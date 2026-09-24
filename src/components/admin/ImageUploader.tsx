"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 4;

export function ImageUploader({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const remainingSlots = MAX_IMAGES - images.length;

  const upload = async (fileList: FileList | File[]) => {
    setError("");
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (remainingSlots <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (accepted.length >= remainingSlots) {
        rejected.push(`${file.name}: only ${remainingSlots} slot(s) left`);
        continue;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name}: only JPG, PNG or WEBP allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: exceeds 5MB`);
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      setError(rejected[0] || "No valid files selected.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    accepted.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        onChange([...images, ...data.urls].slice(0, MAX_IMAGES));
        const messages = [...(data.errors || []), ...rejected];
        if (messages.length) setError(messages.join("; "));
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div key={src} className="relative aspect-square border border-gray-200 bg-gray-50 overflow-hidden">
            <Image src={src} alt={`Product image ${i + 1}`} fill sizes="120px" className="object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] uppercase tracking-wide px-1.5 py-0.5">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 text-white text-xs rounded-full hover:bg-black/80"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              upload(e.dataTransfer.files);
            }}
            disabled={uploading}
            className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center text-center px-2 text-xs text-gray-500 transition-colors disabled:opacity-60 ${
              dragOver ? "border-gray-900 bg-gray-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {uploading ? "Uploading..." : "Click or drag image here"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />

      <p className="mt-2 text-xs text-gray-500">
        Up to {MAX_IMAGES} images. JPG, PNG or WEBP, max 5MB each. First image is the primary image.
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
