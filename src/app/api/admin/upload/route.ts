import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = ACCEPTED_TYPES[file.type];
    if (!ext) {
      errors.push(`${file.name}: only JPG, PNG or WEBP images are allowed`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: exceeds 5MB`);
      continue;
    }

    const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/products/${filename}`);
  }

  if (urls.length === 0) {
    return NextResponse.json({ error: errors.join("; ") || "Upload failed" }, { status: 400 });
  }

  return NextResponse.json({ urls, errors });
}
