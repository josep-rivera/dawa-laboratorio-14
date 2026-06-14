'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingBag, LayoutDashboard, LogOut, User } from 'lucide-react';
import { getUser, clearAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types/product';

export default function NavbarClient() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    setUser(getUser());
    const sync = () => setUser(getUser());
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  const logout = () => {
    clearAuth();
    document.cookie = 'token=; Max-Age=0; path=/';
    document.cookie = 'role=; Max-Age=0; path=/';
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
          <ShoppingBag className="h-5 w-5" />
          Mini Marketplace
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:flex items-center gap-1.5 text-sm text-gray-500">
                <User className="h-3.5 w-3.5" />
                {user.email}
                <span className="rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs font-medium">
                  {user.role}
                </span>
              </span>
              {user.role === 'ADMIN' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Panel</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
