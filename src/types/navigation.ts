export type Cuisine = 'italiana' | 'choperia';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Menu: { cuisine?: Cuisine; search?: string } | undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: undefined;
};