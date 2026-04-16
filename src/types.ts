export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  weight?: number; // in grams
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  subscriptionActive: boolean;
}

export interface CoffeeConfig {
  type: 'grain' | 'ground';
  grind?: 'fine' | 'medium' | 'coarse';
}

export interface CartItem {
  product: Product;
  quantity: number;
  config?: CoffeeConfig;
}
