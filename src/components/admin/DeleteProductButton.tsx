"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const del = async () => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  if (confirming) {
    return (
      <span className="inline-flex gap-2">
        <button onClick={del} className="text-red-600">
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="text-gray-500">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-red-600">
      Delete
    </button>
  );
}
