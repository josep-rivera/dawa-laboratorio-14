'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm;
  const passwordsNoMatch = form.confirm.length > 0 && form.password !== form.confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Error al registrarse'); return; }
      router.push('/login');
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Registrate para empezar a comprar</p>
        </div>

        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
                <div className="relative">
                  <Input
                    type="password"
                    required
                    placeholder="Repetí la contraseña"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className={passwordsNoMatch ? 'border-red-300 focus-visible:ring-red-400' : ''}
                  />
                  {passwordsMatch && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {passwordsNoMatch && (
                  <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</> : 'Crear cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
