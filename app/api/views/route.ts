import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"

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
    const client = await clientPromise
    const db = client.db()

    const uaString = req.headers.get("user-agent") || ""
    const { browser, os, device } = parseUserAgent(uaString)

    // Detect location headers (Vercel specific headers)
    let country = req.headers.get("x-vercel-ip-country") || "Unknown"
    let city = req.headers.get("x-vercel-ip-city") || "Unknown"
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"

    if (ip === "127.0.0.1" || ip === "::1") {
      if (country === "Unknown") country = "Localhost"
      if (city === "Unknown") city = "Localhost"
    }

    const body = await req.json().catch(() => ({}))
    const referrer = body.referrer || "Direct"
    const visitorName = body.name || "Anonymous"
    const path = body.path || "/"

    // Rate-limiting check: skip if views from same IP/device/OS occurred in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const existingRecentView = await db.collection("views").findOne({
      ip,
      device,
      os,
      timestamp: { $gte: twoHoursAgo }
    })

    if (existingRecentView) {
      const totalViews = await db.collection("views").estimatedDocumentCount()
      return NextResponse.json({ success: true, id: existingRecentView._id, totalViews, rateLimited: true })
    }

    const view = {
      timestamp: new Date(),
      device,
      os,
      browser,
      country,
      city,
      referrer,
      ip,
      name: visitorName,
      path
    }

    const result = await db.collection("views").insertOne(view)
    
    // Get total views count
    const totalViews = await db.collection("views").estimatedDocumentCount()

    return NextResponse.json({ success: true, id: result.insertedId, totalViews })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const viewsCollection = db.collection("views")

    // Total view count
    const totalViews = await viewsCollection.estimatedDocumentCount()

    // Aggregate by Device
    const deviceStats = await viewsCollection.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]).toArray()

    // Aggregate by Browser
    const browserStats = await viewsCollection.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } }
    ]).toArray()

    // Aggregate by OS
    const osStats = await viewsCollection.aggregate([
      { $group: { _id: "$os", count: { $sum: 1 } } }
    ]).toArray()

    // Aggregate by Country
    const countryStats = await viewsCollection.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    // Fetch last 100 visitors (names and locations)
    const recentVisitors = await viewsCollection
      .find({}, { projection: { name: 1, country: 1, city: 1, device: 1, timestamp: 1, path: 1 } })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()

    // Aggregate views by day for the last 14 days
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    fourteenDaysAgo.setHours(0, 0, 0, 0)

    const dailyStats = await viewsCollection.aggregate([
      { $match: { timestamp: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    return NextResponse.json({
      totalViews,
      devices: deviceStats.map(item => ({ name: item._id, value: item.count })),
      browsers: browserStats.map(item => ({ name: item._id, value: item.count })),
      os: osStats.map(item => ({ name: item._id, value: item.count })),
      countries: countryStats.map(item => ({ country: item._id, count: item.count })),
      dailyViews: dailyStats.map(item => ({ date: item._id, count: item.count })),
      recentVisitors: recentVisitors.map(item => ({
        id: item._id,
        name: item.name || "Anonymous",
        country: item.country,
        city: item.city,
        device: item.device,
        timestamp: item.timestamp,
        path: item.path || "/"
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
