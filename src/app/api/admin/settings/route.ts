import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      ...(body.whatsappNumber !== undefined && { whatsappNumber: body.whatsappNumber }),
      ...(body.generalMessage !== undefined && { generalMessage: body.generalMessage }),
      ...(body.productEnquiryTemplate !== undefined && { productEnquiryTemplate: body.productEnquiryTemplate }),
      ...(body.questionTemplate !== undefined && { questionTemplate: body.questionTemplate }),
      ...(body.cardEnquiryTemplate !== undefined && { cardEnquiryTemplate: body.cardEnquiryTemplate }),
      ...(body.headerWhatsappEnabled !== undefined && { headerWhatsappEnabled: !!body.headerWhatsappEnabled }),
      ...(body.footerWhatsappEnabled !== undefined && { footerWhatsappEnabled: !!body.footerWhatsappEnabled }),
      ...(body.floatingWhatsappEnabled !== undefined && { floatingWhatsappEnabled: !!body.floatingWhatsappEnabled }),
      ...(body.announcementText !== undefined && { announcementText: body.announcementText }),
      ...(body.announcementColor !== undefined && { announcementColor: body.announcementColor }),
      ...(body.lowStockThreshold !== undefined && { lowStockThreshold: Number(body.lowStockThreshold) }),
      ...(body.newArrivalDays !== undefined && { newArrivalDays: Number(body.newArrivalDays) }),
      ...(body.heavyDiscountThreshold !== undefined && { heavyDiscountThreshold: Number(body.heavyDiscountThreshold) }),
    },
    create: { id: "singleton" },
  });

  return NextResponse.json(settings);
}
