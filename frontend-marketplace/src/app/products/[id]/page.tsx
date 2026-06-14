import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Tag } from 'lucide-react';
import type { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddToCartButton from '@/components/AddToCartButton';

const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h1>
        <p className="text-sm text-gray-500 mb-6">El producto que buscás no existe o fue eliminado.</p>
        <Button variant="outline" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/"><ArrowLeft className="h-4 w-4" /> Volver al catálogo</Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative bg-gray-100 aspect-square md:aspect-auto min-h-[300px]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl">📦</div>
            )}
          </div>

          {/* Info */}
          <CardContent className="p-8 flex flex-col gap-4 justify-center">
            {product.Category && (
              <Badge className="w-fit">
                <Tag className="h-3 w-3 mr-1" />
                {product.Category.nombre}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>
            {product.descripcion && (
              <p className="text-gray-500 text-sm leading-relaxed">{product.descripcion}</p>
            )}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Precio</p>
              <p className="text-3xl font-bold text-indigo-600 tabular-nums">
                S/ {Number(product.precio).toFixed(2)}
              </p>
            </div>
            <AddToCartButton productName={product.nombre} />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
