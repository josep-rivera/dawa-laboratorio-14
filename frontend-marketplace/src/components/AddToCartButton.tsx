'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddToCartButton({ productName }: { productName: string }) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <Button
      size="lg"
      className={`w-full sm:w-auto mt-2 transition-all duration-300 ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
      onClick={handleClick}
      aria-label={`Agregar ${productName} al carrito`}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          ¡Agregado al carrito!
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Agregar al carrito
        </>
      )}
    </Button>
  );
}
