import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, Category } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getProducts(categoryId?: string): Promise<Product[]> {
  const url = categoryId ? `${API}/api/products?categoryId=${categoryId}` : `${API}/api/products`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await props.searchParams;
  const [products, categories] = await Promise.all([getProducts(category), getCategories()]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
        <p className="text-gray-500 mt-1">
          {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtrar:
          </span>
          <Link
            href="/"
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
              !category
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                category === String(cat.id)
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat.nombre}
            </Link>
          ))}
        </div>
      )}

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-3xl">🛍️</div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No hay productos</h3>
          <p className="text-sm text-gray-500 mb-4">No encontramos productos en esta categoría.</p>
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group focus-visible:outline-none">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-indigo-500">
                <div className="relative bg-gray-100 aspect-[4/3] overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.nombre}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📦</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  {product.Category && (
                    <Badge className="w-fit">{product.Category.nombre}</Badge>
                  )}
                  <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-150">
                    {product.nombre}
                  </h2>
                  {product.descripcion && (
                    <p className="text-xs text-gray-500 line-clamp-2 flex-1">{product.descripcion}</p>
                  )}
                  <p className="text-lg font-bold text-indigo-600 tabular-nums mt-auto">
                    S/ {Number(product.precio).toFixed(2)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
