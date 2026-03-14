import { NextResponse } from "next/server";
import { workOrders } from "@/lib/data/mock";

export async function GET() {
  return NextResponse.json({
    data: workOrders,
    meta: {
      active: workOrders.filter(
        (order) => order.status !== "completed",
      ).length,
    },
  });
}
