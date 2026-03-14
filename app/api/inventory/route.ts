import { NextResponse } from "next/server";
import { inventory } from "@/lib/data/mock";

export async function GET() {
  const lowStock = inventory.filter(
    (item) => item.quantity <= item.minThreshold,
  ).map((item) => item.id);

  return NextResponse.json({
    data: inventory,
    meta: { lowStock },
  });
}
