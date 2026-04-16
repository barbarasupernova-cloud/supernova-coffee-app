import { Product } from './types';

export const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  ACCENT_RED: '#E53E3E',
};

export const LOGOS = {
  MAIN: 'https://i.imgur.com/wzPfJj0.jpeg',
  HORIZONTAL: 'https://i.imgur.com/wzPfJj0.jpeg',
  SQUARE: 'https://i.imgur.com/wzPfJj0.jpeg',
  DARK: 'https://i.imgur.com/MF8HoL9.jpeg',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Café Especial em Grãos 250g',
    price: 45.00,
    description: 'Notas de chocolate e caramelo, torra média.',
    image: 'https://picsum.photos/seed/coffee1/400/400',
    weight: 250,
  },
  {
    id: '2',
    name: 'Café Reserva Especial 250g',
    price: 65.00,
    description: 'Notas frutadas e acidez cítrica equilibrada.',
    image: 'https://picsum.photos/seed/coffee2/400/400',
    weight: 250,
  },
  {
    id: '3',
    name: 'Kit Degustação Supernova',
    price: 120.00,
    description: '3 variedades de 100g para os amantes de café.',
    image: 'https://picsum.photos/seed/coffee3/400/400',
    weight: 300,
  },
];

export const SUBSCRIPTION_PLAN = {
  id: 'sub_platinum',
  name: 'Assinatura Platinum',
  price: 199.00,
  description: 'Café ilimitado na loja física.',
};
