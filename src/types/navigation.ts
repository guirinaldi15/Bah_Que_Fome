export type Cuisine = 'italiana' | 'choperia';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Categories: { cuisine?: Cuisine } | undefined;
  BuildMeal: undefined;
  GroupOrder: undefined;
  Profile: undefined;
  Menu: { cuisine?: Cuisine; search?: string; category?: string } | undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId?: string } | undefined;
};