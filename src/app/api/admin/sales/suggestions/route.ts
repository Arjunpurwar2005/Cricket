import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.sale.findMany({
    select: { productName: true },
    distinct: ["productName"],
    orderBy: { productName: "asc" },
  });
  return NextResponse.json({ names: rows.map((r) => r.productName) });
}
