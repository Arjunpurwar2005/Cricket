import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Cricket Bats", slug: "cricket-bats", description: "English and Kashmir willow bats for every format." },
  { name: "Cricket Balls", slug: "cricket-balls", description: "Match and practice balls in leather, tennis and synthetic." },
  { name: "Batting Gloves", slug: "batting-gloves", description: "Protective, high-grip batting gloves." },
  { name: "Batting Pads", slug: "batting-pads", description: "Lightweight leg guards for batters." },
  { name: "Helmets", slug: "helmets", description: "Certified head protection for batting and keeping." },
  { name: "Cricket Shoes", slug: "cricket-shoes", description: "Spiked and rubber-sole footwear for every surface." },
  { name: "Cricket Bags", slug: "cricket-bags", description: "Kit bags and backpacks for players and clubs." },
  { name: "Cricket Kits", slug: "cricket-kits", description: "Complete bundled kits for beginners and clubs." },
  { name: "Accessories", slug: "accessories", description: "Grips, guards and small essentials." },
];

const BRANDS = [
  { name: "SS", slug: "ss" },
  { name: "SG", slug: "sg" },
  { name: "MRF", slug: "mrf" },
  { name: "GM", slug: "gm" },
  { name: "DSC", slug: "dsc" },
  { name: "Kookaburra", slug: "kookaburra" },
  { name: "Gray-Nicolls", slug: "gray-nicolls" },
  { name: "Shrey", slug: "shrey" },
];

const IMG = (seed: string) => `https://picsum.photos/seed/${seed}/900/900`;

async function main() {
  console.log("Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const [i, c] of CATEGORIES.entries()) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, order: i },
    });
    categoryMap.set(c.slug, cat.id);
  }

  console.log("Seeding brands...");
  const brandMap = new Map<string, string>();
  for (const [i, b] of BRANDS.entries()) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, order: i },
    });
    brandMap.set(b.slug, brand.id);
  }

  console.log("Seeding admin account...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log("Seeding settings...");
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "910000000000",
    },
  });

  console.log("Seeding sample products (dev data — replace via admin)...");

  const products = [
    {
      name: "SS TON Reserve Edition",
      slug: "ss-ton-reserve-edition",
      sku: "SS-BAT-001",
      brand: "ss",
      category: "cricket-bats",
      price: 12999,
      mrp: 16999,
      stock: 8,
      shortTagline: "Premium English willow bat, Grade 1.",
      description:
        "The SS TON Reserve Edition is crafted from hand-selected Grade 1 English willow, offering a large sweet spot and balanced pick-up for top-order batters.",
      specifications: [
        { name: "Willow Type", value: "English Willow" },
        { name: "Bat Size", value: "SH" },
        { name: "Weight", value: "1160-1200g" },
        { name: "Grade", value: "Grade 1" },
        { name: "Handle", value: "Toe Grip Cane Handle" },
        { name: "Profile", value: "Mid-to-low, thick edges" },
      ],
      options: [{ name: "Size", values: ["Harrow", "SH"] }],
      bestSeller: true,
      featured: true,
    },
    {
      name: "SS TON Player Edition",
      slug: "ss-ton-player-edition",
      sku: "SS-BAT-002",
      brand: "ss",
      category: "cricket-bats",
      price: 8999,
      mrp: 11999,
      stock: 15,
      shortTagline: "Kashmir willow bat for club-level play.",
      description: "A dependable Kashmir willow bat built for consistent middle-order performance.",
      specifications: [
        { name: "Willow Type", value: "Kashmir Willow" },
        { name: "Bat Size", value: "SH" },
        { name: "Weight", value: "1180-1220g" },
        { name: "Grade", value: "Grade 2" },
      ],
      options: [{ name: "Size", values: ["Harrow", "SH", "Academy"] }],
      sale: true,
    },
    {
      name: "SG Scorer Classic",
      slug: "sg-scorer-classic",
      sku: "SG-BAT-001",
      brand: "sg",
      category: "cricket-bats",
      price: 6499,
      mrp: 7999,
      stock: 3,
      shortTagline: "Entry-level bat with a forgiving profile.",
      description: "Ideal for academy players building technique, with a light pick-up and durable profile.",
      specifications: [
        { name: "Willow Type", value: "Kashmir Willow" },
        { name: "Bat Size", value: "Academy" },
        { name: "Weight", value: "1100-1140g" },
      ],
      options: [{ name: "Size", values: ["Academy", "Harrow"] }],
    },
    {
      name: "MRF Genius Grand Edition",
      slug: "mrf-genius-grand-edition",
      sku: "MRF-BAT-001",
      brand: "mrf",
      category: "cricket-bats",
      price: 24999,
      mrp: 27999,
      stock: 5,
      shortTagline: "Pro-grade English willow, as used by top order batters.",
      description: "A pro-grade bat with a full profile and large edges for maximum power.",
      specifications: [
        { name: "Willow Type", value: "English Willow" },
        { name: "Bat Size", value: "SH" },
        { name: "Weight", value: "1200-1240g" },
        { name: "Grade", value: "Grade 1+" },
      ],
      options: [{ name: "Size", values: ["SH"] }],
      bestPrice: true,
    },
    {
      name: "Kookaburra Turf Test Ball",
      slug: "kookaburra-turf-test-ball",
      sku: "KB-BALL-001",
      brand: "kookaburra",
      category: "cricket-balls",
      price: 899,
      mrp: 1099,
      stock: 60,
      shortTagline: "Four-piece leather ball for match play.",
      description: "A durable four-piece leather ball designed for red-ball match conditions.",
      specifications: [
        { name: "Ball Type", value: "Four-piece leather" },
        { name: "Material", value: "Genuine leather, cork core" },
        { name: "Weight", value: "156g" },
        { name: "Colour", value: "Red" },
        { name: "Format", value: "Test / First-class" },
      ],
      options: [],
    },
    {
      name: "SG Club White Ball",
      slug: "sg-club-white-ball",
      sku: "SG-BALL-001",
      brand: "sg",
      category: "cricket-balls",
      price: 649,
      mrp: 749,
      stock: 40,
      shortTagline: "Two-piece white ball for limited-overs practice.",
      description: "Machine-stitched white ball suited for club and practice limited-overs matches.",
      specifications: [
        { name: "Ball Type", value: "Two-piece" },
        { name: "Colour", value: "White" },
        { name: "Format", value: "ODI / T20 practice" },
      ],
      options: [],
    },
    {
      name: "GM Original Batting Gloves",
      slug: "gm-original-batting-gloves",
      sku: "GM-GLV-001",
      brand: "gm",
      category: "batting-gloves",
      price: 3499,
      mrp: 4499,
      stock: 20,
      shortTagline: "High-density foam protection with premium grip.",
      description: "Engineered for comfort and protection, with a supple leather palm for a natural grip on the bat handle.",
      specifications: [
        { name: "Hand", value: "Right / Left" },
        { name: "Size", value: "Men" },
        { name: "Material", value: "PU + Leather palm" },
        { name: "Protection", value: "High-density foam" },
      ],
      options: [{ name: "Size", values: ["Men", "Youth", "Junior"] }],
      bestSeller: true,
    },
    {
      name: "DSC Intense Batting Gloves",
      slug: "dsc-intense-batting-gloves",
      sku: "DSC-GLV-001",
      brand: "dsc",
      category: "batting-gloves",
      price: 1999,
      mrp: 2999,
      stock: 25,
      shortTagline: "Lightweight gloves for junior and academy players.",
      description: "A lightweight glove built for young players developing their technique.",
      specifications: [
        { name: "Hand", value: "Right / Left" },
        { name: "Size", value: "Youth" },
        { name: "Material", value: "PU" },
      ],
      options: [{ name: "Size", values: ["Youth", "Junior"] }],
      sale: true,
    },
    {
      name: "Shrey Pro Guard Helmet",
      slug: "shrey-pro-guard-helmet",
      sku: "SHR-HLM-001",
      brand: "shrey",
      category: "helmets",
      price: 5499,
      mrp: 6999,
      stock: 12,
      shortTagline: "Titanium grille helmet with certified protection.",
      description: "A titanium-grille helmet offering a lightweight fit without compromising on certified head protection.",
      specifications: [
        { name: "Size", value: "M / L" },
        { name: "Shell Material", value: "ABS + Titanium grille" },
        { name: "Grille", value: "Titanium" },
        { name: "Certification", value: "BS7928:2013" },
      ],
      options: [{ name: "Size", values: ["S", "M", "L"] }],
      featured: true,
    },
    {
      name: "GM Icon Helmet",
      slug: "gm-icon-helmet",
      sku: "GM-HLM-001",
      brand: "gm",
      category: "helmets",
      price: 3999,
      mrp: 4999,
      stock: 0,
      shortTagline: "Steel grille helmet for club-level batters.",
      description: "A dependable steel-grille helmet suited for club and school-level cricket.",
      specifications: [
        { name: "Size", value: "M" },
        { name: "Shell Material", value: "ABS" },
        { name: "Grille", value: "Steel" },
        { name: "Certification", value: "BS7928:2013" },
      ],
      options: [{ name: "Size", values: ["S", "M", "L"] }],
    },
    {
      name: "New Balance CK4040 Spikes",
      slug: "new-balance-ck4040-spikes",
      sku: "NB-SHO-001",
      brand: "gm",
      category: "cricket-shoes",
      price: 6999,
      mrp: 8499,
      stock: 10,
      shortTagline: "Full-spike cricket shoes for pace bowlers.",
      description: "Built for stability under load, with a full-spike outsole for grass surfaces.",
      specifications: [
        { name: "Size", value: "UK 7-11" },
        { name: "Sole Type", value: "Full spike" },
        { name: "Spikes/Studs", value: "6-stud rubber spike" },
        { name: "Surface", value: "Turf / Grass" },
      ],
      options: [{ name: "Size", values: ["7", "8", "9", "10", "11"] }],
    },
    {
      name: "SS Camo Kit Bag",
      slug: "ss-camo-kit-bag",
      sku: "SS-BAG-001",
      brand: "ss",
      category: "cricket-bags",
      price: 2999,
      mrp: 3999,
      stock: 18,
      shortTagline: "Large-capacity wheelie kit bag.",
      description: "A spacious wheeled kit bag with dedicated compartments for bats, pads and shoes.",
      specifications: [
        { name: "Capacity", value: "Large (2-3 bats)" },
        { name: "Compartments", value: "3 main, 2 side" },
        { name: "Material", value: "600D polyester" },
      ],
      options: [],
      newArrivalOverride: true,
    },
  ];

  for (const p of products) {
    const { brand, category, options, specifications, ...rest } = p as typeof products[number] & {
      newArrivalOverride?: boolean;
    };
    const brandId = brandMap.get(brand);
    const categoryId = categoryMap.get(category);
    if (!brandId || !categoryId) continue;

    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        name: rest.name,
        slug: rest.slug,
        sku: rest.sku,
        brandId,
        categoryId,
        price: rest.price,
        mrp: rest.mrp,
        stock: rest.stock,
        shortTagline: rest.shortTagline,
        description: rest.description,
        specifications: JSON.stringify(specifications),
        options: JSON.stringify(options),
        images: JSON.stringify([IMG(rest.slug), IMG(rest.slug + "-2"), IMG(rest.slug + "-3")]),
        bestSeller: !!rest.bestSeller,
        bestPrice: !!rest.bestPrice,
        sale: !!rest.sale,
        featured: !!rest.featured,
        published: true,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
