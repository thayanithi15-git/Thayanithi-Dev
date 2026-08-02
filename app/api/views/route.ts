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
    const client = await clientPromise
    const db = client.db()
    const viewsCollection = db.collection("views")

    const uaString = req.headers.get("user-agent") || ""
    const { browser, os, device } = parseUserAgent(uaString)
    const { country, city, ip } = await getAccurateLocation(req.headers)

    const body = await req.json().catch(() => ({}))
    const referrer = body.referrer || "Direct"
    const visitorName = body.name || "Anonymous"
    const visitorEmail = body.email || ""
    const path = body.path || "/"

    // Strict 2-hour Rate Limiting & Deduplication:
    // Check if the same user (by IP, device, and location OR email) has logged a visit within the last 2 hours.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

    const matchConditions: any[] = [
      { ip, device, country },
      { ip }
    ]
    if (visitorEmail) {
      matchConditions.push({ email: visitorEmail })
    }

    const existingRecentView = await viewsCollection.findOne({
      timestamp: { $gte: twoHoursAgo },
      $or: matchConditions
    })

    if (existingRecentView) {
      // User visited within 2 hours -> Store as a single entry by updating timestamp & metrics instead of adding duplicate logs
      await viewsCollection.updateOne(
        { _id: existingRecentView._id },
        {
          $set: {
            timestamp: new Date(),
            path,
            country,
            city,
            browser,
            os,
            device,
            ...(visitorName && visitorName !== "Anonymous" ? { name: visitorName } : {})
          },
          $inc: { visitCount: 1 }
        }
      )

      const totalViews = await viewsCollection.estimatedDocumentCount()
      return NextResponse.json({
        success: true,
        id: existingRecentView._id,
        totalViews,
        rateLimited: true,
        message: "Visitor entry updated (2-hour rate-limit active, no duplicate log created)."
      })
    }

    // First visit in > 2 hours -> Insert a new footprint document
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
      email: visitorEmail,
      path,
      visitCount: 1
    }

    const result = await viewsCollection.insertOne(view)
    const totalViews = await viewsCollection.estimatedDocumentCount()

    return NextResponse.json({ success: true, id: result.insertedId, totalViews })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    const viewsCollection = db.collection("views")

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "day" // 'day' | 'week' | 'month' | 'year'
    const search = searchParams.get("search") || ""
    const location = searchParams.get("location") || ""
    const deviceParam = searchParams.get("device") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "8", 10)

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

    // Footprint Chart Aggregation based on Period (day, week, month, year)
    let timeRangeAgo = new Date()
    let footprintList: { date: string; count: number }[] = []

    if (period === "week") {
      timeRangeAgo.setDate(timeRangeAgo.getDate() - 90) // Last ~12 weeks
      timeRangeAgo.setHours(0, 0, 0, 0)

      const dailyStats = await viewsCollection.aggregate([
        { $match: { timestamp: { $gte: timeRangeAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()

      // Map daily stats into clear week date ranges (e.g. "Jul 28 - Aug 3")
      const weekMap = new Map<string, number>()
      for (const item of dailyStats) {
        const d = new Date(item._id + "T00:00:00")
        const dayOfWeek = d.getDay()
        const diffToMonday = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
        const monday = new Date(d.setDate(diffToMonday))
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)

        const startM = monday.toLocaleDateString("en-US", { month: "short" })
        const startD = monday.getDate()
        const endM = sunday.toLocaleDateString("en-US", { month: "short" })
        const endD = sunday.getDate()

        const weekLabel = startM === endM ? `${startM} ${startD} - ${endD}` : `${startM} ${startD} - ${endM} ${endD}`
        weekMap.set(weekLabel, (weekMap.get(weekLabel) || 0) + item.count)
      }

      footprintList = Array.from(weekMap.entries()).map(([date, count]) => ({ date, count }))
    } else if (period === "month") {
      timeRangeAgo.setMonth(timeRangeAgo.getMonth() - 12) // Last 12 months
      timeRangeAgo.setHours(0, 0, 0, 0)

      const monthStats = await viewsCollection.aggregate([
        { $match: { timestamp: { $gte: timeRangeAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()

      footprintList = monthStats.map(item => {
        const [year, month] = item._id.split("-")
        const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
        const monthLabel = `${d.toLocaleDateString("en-US", { month: "short" })} ${year}`
        return { date: monthLabel, count: item.count }
      })
    } else if (period === "year") {
      timeRangeAgo.setFullYear(timeRangeAgo.getFullYear() - 5) // Last 5 years
      timeRangeAgo.setHours(0, 0, 0, 0)

      const yearStats = await viewsCollection.aggregate([
        { $match: { timestamp: { $gte: timeRangeAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$timestamp" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()

      footprintList = yearStats.map(item => ({ date: item._id, count: item.count }))
    } else {
      // Day (default: last 14 days)
      timeRangeAgo.setDate(timeRangeAgo.getDate() - 14)
      timeRangeAgo.setHours(0, 0, 0, 0)

      const dailyStats = await viewsCollection.aggregate([
        { $match: { timestamp: { $gte: timeRangeAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()

      footprintList = dailyStats.map(item => {
        const d = new Date(item._id + "T00:00:00")
        const dateLabel = `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()}`
        return { date: dateLabel, count: item.count }
      })
    }

    // Build filter query for Recent Visitors table
    const filterQuery: any = {}

    if (search.trim()) {
      filterQuery.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } }
      ]
    }

    if (location && location !== "ALL") {
      filterQuery.$and = filterQuery.$and || []
      filterQuery.$and.push({
        $or: [{ country: location }, { city: location }]
      })
    }

    if (deviceParam && deviceParam !== "ALL") {
      filterQuery.device = deviceParam
    }

    if (startDate || endDate) {
      filterQuery.timestamp = filterQuery.timestamp || {}
      if (startDate) {
        filterQuery.timestamp.$gte = new Date(startDate)
      }
      if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        filterQuery.timestamp.$lte = endDateTime
      }
    }

    // Count matching visitor records
    const totalFilteredVisitors = await viewsCollection.countDocuments(filterQuery)

    // Fetch paginated filtered visitors
    const skip = (page - 1) * limit
    const recentVisitors = await viewsCollection
      .find(filterQuery)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get unique locations and devices for filter dropdowns
    const availableLocations = await viewsCollection.distinct("country")
    const availableDevices = await viewsCollection.distinct("device")

    return NextResponse.json({
      totalViews,
      devices: deviceStats.map(item => ({ name: item._id, value: item.count })),
      browsers: browserStats.map(item => ({ name: item._id, value: item.count })),
      os: osStats.map(item => ({ name: item._id, value: item.count })),
      countries: countryStats.map(item => ({ country: item._id, count: item.count })),
      dailyViews: footprintList,
      period,
      recentVisitors: recentVisitors.map(item => ({
        id: item._id,
        name: item.name || "Anonymous",
        email: item.email || "",
        picture: item.picture || "",
        country: item.country || "Unknown",
        city: item.city || "Unknown",
        device: item.device || "Desktop",
        timestamp: item.timestamp,
        path: item.path || "/",
        registered: Boolean(item.registered)
      })),
      pagination: {
        total: totalFilteredVisitors,
        page,
        limit,
        totalPages: Math.ceil(totalFilteredVisitors / limit) || 1
      },
      filters: {
        locations: availableLocations.filter(Boolean),
        devices: availableDevices.filter(Boolean)
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
