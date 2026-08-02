export async function getAccurateLocation(reqHeaders: Headers): Promise<{ country: string; city: string; ip: string }> {
  let country = reqHeaders.get("x-vercel-ip-country") || ""
  let city = reqHeaders.get("x-vercel-ip-city") || ""
  let ip = reqHeaders.get("x-real-ip") || reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"

  // Clean up URI encoded city headers if provided by Vercel
  if (city) {
    try {
      city = decodeURIComponent(city)
    } catch {
      // keep original
    }
  }

  // If Vercel headers are missing or returning Unknown/Localhost, perform IP Geolocation lookup
  const isLocalOrUnknown = !country || country === "Unknown" || country === "Localhost" || !city || city === "Unknown" || city === "Localhost"

  if (isLocalOrUnknown) {
    try {
      // If local IP, query default ip-api to get current machine public IP location
      const queryTarget = (ip === "127.0.0.1" || ip === "::1" || !ip) ? "" : ip
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const geoRes = await fetch(`http://ip-api.com/json/${queryTarget}?fields=status,country,city,query`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (geoRes.ok) {
        const geoData = await geoRes.json()
        if (geoData.status === "success") {
          country = geoData.country || country || "Unknown"
          city = geoData.city || city || "Unknown"
          if (geoData.query) ip = geoData.query
        }
      }
    } catch (err) {
      console.warn("IP Geolocation lookup failed:", err)
    }
  }

  if (!country || country === "Localhost") country = "India" // Default sensible fallback if ip-api unreached
  if (!city || city === "Localhost") city = "Unknown"

  return { country, city, ip }
}
