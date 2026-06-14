import type { Metadata } from 'next';
import './globals.css';
import NavbarClient from './NavbarClient';

export const metadata: Metadata = {
  title: 'Mini Marketplace',
  description: 'Tu tienda online de confianza',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <NavbarClient />
        <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-80px)]">{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-indigo-600">Mini Marketplace</span>
            <p className="text-sm text-gray-400">© 2026 Mini Marketplace. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
