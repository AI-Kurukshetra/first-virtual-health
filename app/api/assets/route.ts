import { NextResponse } from "next/server";
import { assets } from "@/lib/data/mock";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    data: assets,
    meta: {
      count: assets.length,
      generatedAt: new Date().toISOString(),
    },
  });
}
