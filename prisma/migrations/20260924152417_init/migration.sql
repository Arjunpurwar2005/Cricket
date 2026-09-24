-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategory" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "price" DOUBLE PRECISION NOT NULL,
    "mrp" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "description" TEXT NOT NULL DEFAULT '',
    "shortTagline" TEXT NOT NULL DEFAULT '',
    "specifications" TEXT NOT NULL DEFAULT '[]',
    "options" TEXT NOT NULL DEFAULT '[]',
    "customPromotions" TEXT NOT NULL DEFAULT '[]',
    "bestSeller" BOOLEAN NOT NULL DEFAULT false,
    "bestPrice" BOOLEAN NOT NULL DEFAULT false,
    "sale" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "productName" TEXT NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "whatsappNumber" TEXT NOT NULL DEFAULT '910000000000',
    "generalMessage" TEXT NOT NULL DEFAULT 'Hi, I''d like to know more about your cricket equipment.',
    "productEnquiryTemplate" TEXT NOT NULL DEFAULT 'Hi, I''m interested in {name} ({brand}).

Listed price: ₹{price}
MRP: ₹{mrp}
{variant}SKU: {sku}

Please share availability and details.
Product link: {url}',
    "questionTemplate" TEXT NOT NULL DEFAULT 'Hi, I have a question about {name} ({brand}).
Product link: {url}',
    "cardEnquiryTemplate" TEXT NOT NULL DEFAULT 'Hi, I''m interested in {name} ({brand}).

Price: ₹{price}

Please share availability.',
    "headerWhatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "footerWhatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "floatingWhatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "announcementText" TEXT NOT NULL DEFAULT 'FREE DELIVERY ON SELECTED ORDERS • WHATSAPP US FOR BULK ENQUIRIES • NEW CRICKET STOCK AVAILABLE',
    "announcementColor" TEXT NOT NULL DEFAULT '#000000',
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "newArrivalDays" INTEGER NOT NULL DEFAULT 14,
    "heavyDiscountThreshold" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Sale_date_idx" ON "Sale"("date");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
