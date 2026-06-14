'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, Package, Tag, X } from 'lucide-react';
import { getToken, getUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, Category } from '@/types/product';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const EMPTY_FORM = { nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '' };

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [catForm, setCatForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [savingCat, setSavingCat] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [tab, setTab] = useState<'products' | 'categories'>('products');

  const token = getToken();
  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const loadData = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch(`${API}/api/products`),
      fetch(`${API}/api/categories`),
    ]);
    if (pRes.ok) setProducts(await pRes.json());
    if (cRes.ok) setCategories(await cRes.json());
    setLoadingData(false);
  }, []);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'ADMIN') { router.push('/login'); return; }
    loadData();
  }, [router, loadData]);

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      precio: parseFloat(form.precio),
      CategoryId: form.CategoryId ? parseInt(form.CategoryId) : null,
    };
    try {
      if (editId) {
        await fetch(`${API}/api/products/${editId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
      } else {
        await fetch(`${API}/api/products`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
    await loadData();
    setDeletingId(null);
  };

  const submitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCat(true);
    await fetch(`${API}/api/categories`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ nombre: catForm }) });
    setCatForm('');
    await loadData();
    setSavingCat(false);
  };

  const startEdit = (p: Product) => {
    setForm({
      nombre: p.nombre,
      precio: String(p.precio),
      descripcion: p.descripcion ?? '',
      imageUrl: p.imageUrl ?? '',
      CategoryId: p.CategoryId ? String(p.CategoryId) : '',
    });
    setEditId(p.id);
    setTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestioná productos y categorías</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Package className="h-4 w-4" />
            <span className="font-semibold text-gray-900">{products.length}</span> productos
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Tag className="h-4 w-4" />
            <span className="font-semibold text-gray-900">{categories.length}</span> categorías
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {(['products', 'categories'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'products' ? 'Productos' : 'Categorías'}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editId ? 'Editar producto' : 'Nuevo producto'}
                {editId && (
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitProduct} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Nombre *</label>
                  <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Precio (S/) *</label>
                  <Input required type="number" step="0.01" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">URL de imagen</label>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    rows={3}
                    placeholder="Descripción del producto..."
                    className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Categoría</label>
                  <select
                    value={form.CategoryId}
                    onChange={(e) => setForm({ ...form, CategoryId: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : editId ? 'Actualizar' : <><Plus className="h-4 w-4" /> Crear</>}
                  </Button>
                  {editId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancelar</Button>}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="xl:col-span-2">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600 tabular-nums">Precio</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Categoría</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loadingData ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" /><Skeleton className="h-4 w-32" /></div></td>
                          <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="px-4 py-3 hidden sm:table-cell"><Skeleton className="h-5 w-20 rounded-full" /></td>
                          <td className="px-4 py-3 text-right"><Skeleton className="h-7 w-20 ml-auto rounded-lg" /></td>
                        </tr>
                      ))
                    ) : products.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-gray-400 text-sm">No hay productos. Creá el primero.</td></tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {p.imageUrl ? (
                                  <Image src={p.imageUrl} alt={p.nombre} width={40} height={40} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900 max-w-[160px] truncate">{p.nombre}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums">
                            S/ {Number(p.precio).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {p.Category ? <Badge>{p.Category.nombre}</Badge> : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteProduct(p.id)}
                                disabled={deletingId === p.id}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                {deletingId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Nueva categoría</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitCategory} className="space-y-3">
                <Input
                  required
                  placeholder="Ej: Tecnología"
                  value={catForm}
                  onChange={(e) => setCatForm(e.target.value)}
                />
                <Button type="submit" disabled={savingCat} className="w-full">
                  {savingCat ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</> : <><Plus className="h-4 w-4" /> Crear categoría</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Categorías existentes</CardTitle></CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No hay categorías aún.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {categories.map((c) => (
                    <li key={c.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        <Badge>{c.nombre}</Badge>
                      </div>
                      <span className="text-xs text-gray-400">ID: {c.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
