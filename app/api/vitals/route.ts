import { NextRequest, NextResponse } from "next/server";

type Metric = { name: string; value: number; id: string };

export const POST = async (req: NextRequest) => {
  try {
    // Handle both text/plain (sendBeacon default) and application/json
    const text = await req.text();
    if (!text) return NextResponse.json({ ok: true });
    
    const metric = JSON.parse(text) as Metric;
    
    // In a real app, you would send this to Google Analytics, Vercel Analytics, or a custom DB
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid metric data" }, { status: 400 });
  }
};
