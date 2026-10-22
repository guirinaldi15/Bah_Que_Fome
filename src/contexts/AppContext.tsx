import React, {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

import type { Product } from '../data/products';
import type { Cuisine } from '../types/navigation';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type DeliveryMode = 'delivery' | 'pickup';

export type PaymentMethod =
  | 'pix'
  | 'credit'
  | 'debit'
  | 'cash'
  | 'wallet';

export type LocationType =
  | 'residencia'
  | 'hotel'
  | 'pousada'
  | 'turistico';

export type DeliveryInfo = {
  mode: DeliveryMode;
  name: string;
  phone: string;
  locationType: LocationType;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  complement: string;
  reference: string;
  establishment: string;
  room: string;
  instructions: string;
};

export type MockOrder = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  delivery: DeliveryInfo;
  payment: PaymentMethod;
  statusIndex: number;
  createdAt: string;
};

export const DELIVERY_FEE = 12;

const initialDelivery: DeliveryInfo = {
  mode: 'delivery',
  name: '',
  phone: '',
  locationType: 'residencia',
  cep: '',
  street: '',
  number: '',
  district: '',
  city: '',
  complement: '',
  reference: '',
  establishment: '',
  room: '',
  instructions: ''
};

type AppContextValue = {
  userName: string | null;
  cuisine: Cuisine;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  delivery: DeliveryInfo;
  activeOrder: MockOrder | null;

  signIn: (name: string) => void;
  signOut: () => void;
  setCuisine: (cuisine: Cuisine) => void;

  addToCart: (
    product: Product,
    quantity?: number
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  setDelivery: React.Dispatch<
    React.SetStateAction<DeliveryInfo>
  >;

  placeOrder: (payment: PaymentMethod) => boolean;
  advanceOrder: () => void;
};

const AppContext = createContext<
  AppContextValue | undefined
>(undefined);

export function AppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [userName, setUserName] =
    useState<string | null>(null);

  const [cuisine, setCuisine] =
    useState<Cuisine>('italiana');

  const [cart, setCart] = useState<CartItem[]>([]);

  const [delivery, setDelivery] =
    useState<DeliveryInfo>(initialDelivery);

  const [activeOrder, setActiveOrder] =
    useState<MockOrder | null>(null);

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  function signOut() {
    setUserName(null);
    setCart([]);
    setDelivery(initialDelivery);
    setActiveOrder(null);
  }

  function addToCart(
    product: Product,
    quantity = 1
  ) {
    const amount = Math.max(
      1,
      Math.floor(quantity)
    );

    setCart((previous) => {
      const exists = previous.some(
        (item) => item.product.id === product.id
      );

      return exists
        ? previous.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + amount
                }
              : item
          )
        : [...previous, { product, quantity: amount }];
    });
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    setCart((previous) =>
      quantity <= 0
        ? previous.filter(
            (item) => item.product.id !== productId
          )
        : previous.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.floor(quantity)
                }
              : item
          )
    );
  }

  function removeFromCart(productId: string) {
    setCart((previous) =>
      previous.filter(
        (item) => item.product.id !== productId
      )
    );
  }

  function placeOrder(payment: PaymentMethod): boolean {
    if (cart.length === 0) return false;

    const subtotal = cartTotal;

    const deliveryFee =
      delivery.mode === 'delivery'
        ? DELIVERY_FEE
        : 0;

    const order: MockOrder = {
      id: `BF-${Date.now().toString().slice(-6)}`,
      items: cart.map((item) => ({ ...item })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      delivery: { ...delivery },
      payment,
      statusIndex: 0,
      createdAt: new Date().toLocaleString('pt-BR')
    };

    setActiveOrder(order);
    setCart([]);

    return true;
  }

  function advanceOrder() {
    setActiveOrder((previous) => {
      if (!previous) return null;

      const lastStep =
        previous.delivery.mode === 'delivery'
          ? 4
          : 3;

      return {
        ...previous,
        statusIndex: Math.min(
          previous.statusIndex + 1,
          lastStep
        )
      };
    });
  }

  return (
    <AppContext.Provider
      value={{
        userName,
        cuisine,
        cart,
        cartCount,
        cartTotal,
        delivery,
        activeOrder,
        signIn: setUserName,
        signOut,
        setCuisine,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart: () => setCart([]),
        setDelivery,
        placeOrder,
        advanceOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp deve ser usado dentro de AppProvider.'
    );
  }

  return context;
}