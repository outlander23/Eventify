import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    // Here you would typically save the subscription to your database
    // associated with the current user
    console.log("[Push Subscription]", subscription)

    // Example: Save to database
    // await savePushSubscription(userId, subscription)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
