import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseDate(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  // Store at midnight IST so the saved day never shifts
  const d = new Date(`${dateStr}T00:00:00+05:30`);
  if (isNaN(d.getTime())) return null;
  return d;
}

function sanitizePhone(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  let phone = raw.trim();
  if (phone.startsWith("+91")) phone = phone.slice(3);
  else if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  phone = phone.replace(/\D/g, "");
  if (phone.length !== 10) return undefined as unknown as null; // signals invalid
  return phone;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (from || to) {
    where.date = {};
    if (from) {
      const d = parseDate(from);
      if (d) where.date.gte = d;
    }
    if (to) {
      const d = parseDate(to);
      if (d) {
        // include the full "to" day (end of IST day = next midnight IST)
        const endOfDay = new Date(d.getTime() + 24 * 60 * 60 * 1000 - 1);
        where.date.lte = endOfDay;
      }
    }
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // --- Validation ---
  const errors: Record<string, string> = {};

  const productName = typeof body.productName === "string" ? body.productName.trim() : "";
  if (!productName) errors.productName = "Product name is required.";
  else if (productName.length > 120) errors.productName = "Product name must be 120 characters or fewer.";

  const costPrice = Number(body.costPrice);
  if (isNaN(costPrice) || costPrice < 0) errors.costPrice = "Cost price must be 0 or greater.";

  const profit = Number(body.profit);
  if (isNaN(profit)) errors.profit = "Profit must be a number.";

  const finalPrice = costPrice + profit;
  if (!isNaN(costPrice) && !isNaN(profit) && finalPrice < 0)
    errors.finalPrice = "Final price (cost + profit) cannot be negative.";

  const date = parseDate(body.date);
  if (!date) errors.date = "A valid date is required.";

  let customerPhone: string | null = null;
  if (body.customerPhone && body.customerPhone.trim()) {
    const sanitized = sanitizePhone(body.customerPhone);
    if (sanitized === undefined) errors.customerPhone = "Phone must be 10 digits (optionally preceded by +91).";
    else customerPhone = sanitized;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const sale = await prisma.sale.create({
    data: {
      date: date!,
      productName,
      costPrice,
      profit,
      finalPrice,
      customerName: body.customerName?.trim() || null,
      customerPhone,
    },
  });

  return NextResponse.json(sale, { status: 201 });
}
