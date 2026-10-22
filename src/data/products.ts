import type { Cuisine } from '../types/navigation';

export type Product = {
  id: string;
  name: string;
  category: string;
  cuisine: Cuisine;
  description: string;
  price: number;
  emoji: string;
};

// Cardápio 100% local.
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    cuisine: 'italiana',
    description: 'Muçarela, tomate e manjericão fresco.',
    price: 54.9,
    emoji: '🍕'
  },
  {
    id: '2',
    name: 'Pizza Funghi',
    category: 'Pizzas',
    cuisine: 'italiana',
    description: 'Muçarela, cogumelos frescos e orégano.',
    price: 59.9,
    emoji: '🍕'
  },
  {
    id: '3',
    name: 'Pizza Calabresa',
    category: 'Pizzas',
    cuisine: 'italiana',
    description: 'Calabresa, cebola e molho de tomate.',
    price: 56.9,
    emoji: '🍕'
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    category: 'Massas',
    cuisine: 'italiana',
    description: 'Massa artesanal, ovo e pecorino.',
    price: 48.9,
    emoji: '🍝'
  },
  {
    id: '5',
    name: 'Fettuccine Alfredo',
    category: 'Massas',
    cuisine: 'italiana',
    description: 'Massa fresca, manteiga e parmesão.',
    price: 52.9,
    emoji: '🍝'
  },
  {
    id: '6',
    name: 'Bruschetta Classica',
    category: 'Entradas',
    cuisine: 'italiana',
    description: 'Pão tostado, tomate e azeite.',
    price: 28.9,
    emoji: '🥖'
  },
  {
    id: '7',
    name: 'Tiramisù',
    category: 'Sobremesas',
    cuisine: 'italiana',
    description: 'Creme de mascarpone, café e cacau.',
    price: 24.9,
    emoji: '🍰'
  },
  {
    id: '8',
    name: 'Chopp Pilsen 300 ml',
    category: 'Chopp',
    cuisine: 'choperia',
    description: 'Leve e refrescante, servido gelado.',
    price: 12.9,
    emoji: '🍺'
  },
  {
    id: '9',
    name: 'Chopp IPA 300 ml',
    category: 'Chopp',
    cuisine: 'choperia',
    description: 'Amargor marcante e aroma de lúpulo.',
    price: 18.9,
    emoji: '🍺'
  },
  {
    id: '10',
    name: 'Chopp Weiss 500 ml',
    category: 'Chopp',
    cuisine: 'choperia',
    description: 'Chopp de trigo encorpado.',
    price: 19.9,
    emoji: '🍻'
  },
  {
    id: '11',
    name: 'Caipirinha',
    category: 'Drinks',
    cuisine: 'choperia',
    description: 'Limão, açúcar, gelo e cachaça.',
    price: 22.9,
    emoji: '🍹'
  },
  {
    id: '12',
    name: 'Batata rústica',
    category: 'Porções',
    cuisine: 'choperia',
    description: 'Batatas douradas com temperos.',
    price: 29.9,
    emoji: '🍟'
  },
  {
    id: '13',
    name: 'Polenta frita',
    category: 'Porções',
    cuisine: 'choperia',
    description: 'Polenta crocante por fora e macia por dentro.',
    price: 27.9,
    emoji: '🍟'
  },
];

export const CATEGORIES: Record<Cuisine, string[]> = {
  italiana: [
    'Todos',
    'Entradas',
    'Pizzas',
    'Massas',
    'Sobremesas'
  ],
  choperia: [
    'Todos',
    'Chopp',
    'Drinks',
    'Porções'
  ],
};

export function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}