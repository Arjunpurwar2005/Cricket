import { prisma } from "@/lib/prisma";
import SalesDashboard from "./_components/SalesDashboard";

export default async function AdminDashboard() {
  const published = await prisma.product.count({ where: { published: true } });

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Products section */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-4">Products</h2>
        <div className="bg-white border border-gray-200 rounded p-5 w-fit min-w-[160px]">
          <p className="text-xs uppercase tracking-wide text-gray-500">Published</p>
          <p className="mt-2 text-3xl font-semibold">{published}</p>
        </div>
      </section>

      {/* Sales & Analytics section */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Sales &amp; Analytics
        </h2>
        <SalesDashboard />
      </section>
    </div>
  );
}
