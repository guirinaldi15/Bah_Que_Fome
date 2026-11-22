import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '../data/products';
import type { Cuisine } from '../types/navigation';
import type { DietaryRestriction } from '../types/dietary';

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
  | 'turistico'
  | 'other';

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
  state: string;
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
  delivery: Pick<DeliveryInfo, 'mode'>;
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
  state: '',
  complement: '',
  reference: '',
  establishment: '',
  room: '',
  instructions: '',
};

type AppContextValue = {
  userName: string | null;
  cuisine: Cuisine;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  delivery: DeliveryInfo;
  activeOrder: MockOrder | null;
  orders: MockOrder[];

  dietaryRestrictions: DietaryRestriction[];
  saveDietaryRestrictions: (values: DietaryRestriction[]) => void;

  signIn: (
    name: string,
    restrictions?: DietaryRestriction[],
    email?: string
  ) => void;

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
  advanceOrder: (orderId: string) => void;
};

const AppContext = createContext<
  AppContextValue | undefined
>(undefined);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] =
    useState<string | null>(null);

  const [cuisine, setCuisine] =
    useState<Cuisine>('italiana');

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [delivery, setDelivery] =
    useState<DeliveryInfo>(initialDelivery);

  const [orders, setOrders] = useState<MockOrder[]>([]);
  const activeOrder = orders[0] ?? null;
  const [orderStorageKey, setOrderStorageKey] = useState<string>();
  const [loadedOrderStorageKey, setLoadedOrderStorageKey] = useState<string>();

  React.useEffect(() => {
    if (!orderStorageKey) return;

    let current = true;
    AsyncStorage.getItem(orderStorageKey).then(saved => {
      if (!current) return;
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return;

      setOrders(previous => [
        ...previous,
        ...parsed.filter(order => !previous.some(existing => existing.id === order.id)),
      ]);
      setLoadedOrderStorageKey(orderStorageKey);
    }).catch(error => console.warn('Erro ao carregar pedidos:', error));

    return () => { current = false; };
  }, [orderStorageKey]);

  React.useEffect(() => {
    if (!orderStorageKey || orderStorageKey !== loadedOrderStorageKey) return;
    AsyncStorage.setItem(orderStorageKey, JSON.stringify(orders))
      .catch(error => console.warn('Erro ao salvar pedidos:', error));
  }, [loadedOrderStorageKey, orderStorageKey, orders]);

  const [dietaryRestrictions, setDietaryRestrictions] =
    useState<DietaryRestriction[]>([]);

  React.useEffect(() => {
    async function loadDietaryRestrictions() {
      try {
        const saved = await AsyncStorage.getItem(
          '@bahquefome:dietaryRestrictions'
        );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setDietaryRestrictions(parsed);
          }
        }
      } catch (error) {
        console.warn(
          'Erro ao carregar restrições alimentares:',
          error
        );
      }
    }

    loadDietaryRestrictions();
  }, []);

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

  function signIn(
    name: string,
    restrictions?: DietaryRestriction[],
    email?: string
  ) {
    setOrderStorageKey(email ? `@bahquefome:orders:${email.trim().toLowerCase()}` : undefined);
    setUserName(name);

    if (restrictions !== undefined) {
      saveDietaryRestrictions(restrictions);
    }
  }

  function saveDietaryRestrictions(values: DietaryRestriction[]) {
    setDietaryRestrictions(values);
    AsyncStorage.setItem(
      '@bahquefome:dietaryRestrictions',
      JSON.stringify(values)
    ).catch(error => {
      console.warn('Erro ao salvar restrições alimentares:', error);
    });
  }

  function signOut() {
    setUserName(null);
    setCart([]);
    setDelivery(initialDelivery);
    setOrderStorageKey(undefined);
    setLoadedOrderStorageKey(undefined);
    setOrders([]);
    setDietaryRestrictions([]);

    AsyncStorage.removeItem('@bahquefome:dietaryRestrictions').catch(error => {
      console.warn('Erro ao limpar restrições:', error);
    });
  }

  function addToCart(
    product: Product,
    quantity = 1
  ) {
    const amount = Math.max(
      1,
      Math.floor(quantity)
    );

    setCart(previous => {
      const exists = previous.some(
        item => item.product.id === product.id
      );

      return exists
        ? previous.map(item =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + amount,
                }
              : item
          )
        : [
            ...previous,
            {
              product,
              quantity: amount,
            },
          ];
    });
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    setCart(previous =>
      quantity <= 0
        ? previous.filter(
            item => item.product.id !== productId
          )
        : previous.map(item =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.floor(quantity),
                }
              : item
          )
    );
  }

  function removeFromCart(productId: string) {
    setCart(previous =>
      previous.filter(
        item => item.product.id !== productId
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function placeOrder(
    payment: PaymentMethod
  ): boolean {
    if (cart.length === 0) {
      return false;
    }

    const subtotal = cartTotal;

    const deliveryFee =
      delivery.mode === 'delivery'
        ? DELIVERY_FEE
        : 0;

    const order: MockOrder = {
      id: `BF-${Date.now()}`,
      items: cart.map(item => ({ ...item })),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      delivery: { mode: delivery.mode },
      payment,
      statusIndex: 0,
      createdAt: new Date().toLocaleString('pt-BR'),
    };

    setOrders(previous => [order, ...previous]);
    setCart([]);

    return true;
  }

  function advanceOrder(orderId: string) {
    setOrders(previous => previous.map(order => {
      if (order.id !== orderId) return order;
      const lastStep = order.delivery.mode === 'delivery' ? 4 : 3;
      return { ...order, statusIndex: Math.min(order.statusIndex + 1, lastStep) };
    }));
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
        orders,
        dietaryRestrictions,
        saveDietaryRestrictions,

        signIn,
        signOut,
        setCuisine,

        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,

        setDelivery,
        placeOrder,
        advanceOrder,
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