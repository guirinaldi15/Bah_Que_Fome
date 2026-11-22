import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import { useApp } from '../contexts/AppContext';

import type {
  RootStackParamList
} from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';

import { CategoriesScreen, BuildMealScreen, ProfileScreen } from '../screens/ExploreScreens';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { userName } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        {userName === null ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="Categories"
              component={CategoriesScreen}
            />
            <Stack.Screen name="BuildMeal" component={BuildMealScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />

            <Stack.Screen
              name="Menu"
              component={MenuScreen}
            />

            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
            />

            <Stack.Screen
              name="Cart"
              component={CartScreen}
            />

            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
            />

            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}