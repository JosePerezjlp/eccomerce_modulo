import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; brand?: string };
}) {
  const products = await getProducts({ search: searchParams.search, brand: searchParams.brand });
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-8 text-white">
        <h1 className="text-3xl font-extrabold">Módulos de pantalla originales</h1>
        <p className="mt-2 max-w-xl text-brand-50">
          Repuestos para Samsung, iPhone, Xiaomi y más. Elegí tu módulo, armá tu pedido y
          transferí de forma segura.
        </p>
      </section>

      <form className="mb-6 flex flex-wrap gap-3" action="/">
        <input
          type="text"
          name="search"
          placeholder="Buscar por modelo, marca o SKU..."
          defaultValue={searchParams.search}
          className="min-w-[240px] flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
        <select
          name="brand"
          defaultValue={searchParams.brand ?? ''}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white">
          Buscar
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
