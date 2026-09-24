"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [""];

  return (
    <div>
      <div className="relative aspect-square bg-bg-image-tile border border-border overflow-hidden">
        {list[active] ? (
          <Image src={list[active]} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs uppercase">
            No image
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-[72px] h-[72px] border ${
                active === i ? "border-accent-dark" : "border-border"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              {src && <Image src={src} alt="" fill sizes="72px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
