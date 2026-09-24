import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseDate(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(`${dateStr}T00:00:00+05:30`);
  if (isNaN(d.getTime())) return null;
  return d;
}

function sanitizePhone(raw: string): string | null | undefined {
  if (!raw || !raw.trim()) return null;
  let phone = raw.trim();
  if (phone.startsWith("+91")) phone = phone.slice(3);
  else if (phone.startsWith("91") && phone.length === 12) phone = phone.slice(2);
  phone = phone.replace(/\D/g, "");
  if (phone.length !== 10) return undefined; // signals invalid
  return phone;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

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
    else customerPhone = sanitized as string | null;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const sale = await prisma.sale.update({
    where: { id },
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

  return NextResponse.json(sale);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.sale.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
