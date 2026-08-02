import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getAccurateLocation } from "@/lib/location"

function parseUserAgent(uaString: string) {
  const ua = uaString || ""
  let browser = "Other"
  let os = "Other"
  let device = "Desktop"

  if (/ipad|playbook|silk/i.test(ua)) {
    device = "Tablet"
  } else if (/mobile|iphone|android|phone/i.test(ua)) {
    device = "Mobile"
  }

  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr/i.test(ua)) {
    browser = "Chrome"
  } else if (/firefox|iceweasel/i.test(ua)) {
    browser = "Firefox"
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari"
  } else if (/edge|edg/i.test(ua)) {
    browser = "Edge"
  } else if (/opr/i.test(ua)) {
    browser = "Opera"
  }

  if (/windows/i.test(ua)) {
    os = "Windows"
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS"
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS"
  } else if (/android/i.test(ua)) {
    os = "Android"
  } else if (/linux/i.test(ua)) {
    os = "Linux"
  }

  return { browser, os, device }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const credential = body.credential || body.idToken

    // SECURITY CHECK: Reject any request that does not contain a Google ID Token credential
    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        { error: "Unauthorized: A valid Google ID Token credential is required to register. Direct POST without Gsignin token is blocked." },
        { status: 401 }
      )
    }

    // Cryptographically verify Google ID Token with Google OAuth tokeninfo service
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
    
    if (!verifyRes.ok) {
      return NextResponse.json(
        { error: "Unauthorized: Google ID Token verification failed or token expired." },
        { status: 401 }
      )
    }

    const payload = await verifyRes.json()

    // Verify audience matches configured Google Client ID
    const validClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.client_id
    if (validClientId && payload.aud !== validClientId) {
      return NextResponse.json(
        { error: "Unauthorized: Token audience does not match configured Google Client ID." },
        { status: 401 }
      )
    }

    // Ensure email is verified by Google
    if (payload.email_verified !== "true" && payload.email_verified !== true) {
      return NextResponse.json(
        { error: "Unauthorized: Google account email is not verified." },
        { status: 401 }
      )
    }

    const name = payload.name || "Google User"
    const email = payload.email || ""
    const picture = payload.picture || ""
    const path = body.path || "/stats"

    // Parse user agent and location accurately
    const uaString = req.headers.get("user-agent") || ""
    const { browser, os, device } = parseUserAgent(uaString)
    const { country, city, ip } = await getAccurateLocation(req.headers)

    const client = await clientPromise
    const db = client.db()
    const viewsCollection = db.collection("views")

    // Deduplication & 2-Hour Rate Limiting check:
    // Find existing footprint by email OR (same IP + device within the last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const existingUser = await viewsCollection.findOne({
      $or: [
        { email: email },
        { ip: ip, device: device, timestamp: { $gte: twoHoursAgo } }
      ]
    })

    if (existingUser) {
      // Update existing record for this user (prevent duplicate rows for same user)
      await viewsCollection.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            name,
            email,
            picture,
            country,
            city,
            device,
            os,
            browser,
            ip,
            path,
            timestamp: new Date(),
            registered: true
          },
          $inc: { visitCount: 1 }
        }
      )

      const totalViews = await viewsCollection.estimatedDocumentCount()
      return NextResponse.json({
        success: true,
        id: existingUser._id,
        name,
        email,
        picture,
        totalViews,
        message: "Visitor footprint updated successfully."
      })
    } else {
      // Insert new verified footprint document
      const newVisitor = {
        name,
        email,
        picture,
        country,
        city,
        device,
        os,
        browser,
        ip,
        path,
        timestamp: new Date(),
        registered: true,
        visitCount: 1
      }

      const result = await viewsCollection.insertOne(newVisitor)
      const totalViews = await viewsCollection.estimatedDocumentCount()

      return NextResponse.json({
        success: true,
        id: result.insertedId,
        name,
        email,
        picture,
        totalViews,
        message: "Visitor footprint registered successfully."
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
