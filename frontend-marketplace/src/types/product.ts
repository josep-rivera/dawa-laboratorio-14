export interface Category {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string | null;
  imageUrl: string | null;
  CategoryId: number | null;
  Category?: Category;
}

export interface User {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
