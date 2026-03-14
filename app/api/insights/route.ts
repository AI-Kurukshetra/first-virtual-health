import { NextResponse } from "next/server";
import { insights } from "@/lib/data/mock";

export async function GET() {
  return NextResponse.json({
    data: insights,
    meta: {
      impactCounts: insights.reduce<Record<string, number>>((acc, item) => {
        acc[item.impact] = (acc[item.impact] ?? 0) + 1;
        return acc;
      }, {}),
    },
  });
}
