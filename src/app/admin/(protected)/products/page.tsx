import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="bg-gray-900 text-white px-4 py-2 text-sm uppercase tracking-wide">
          + New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span className={p.published ? "text-green-600" : "text-gray-400"}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}`} className="text-blue-600 mr-3">
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-sm text-gray-500">No products yet.</p>}
      </div>
    </div>
  );
}
