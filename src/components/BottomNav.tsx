import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import type {
  NativeStackNavigationProp
} from '@react-navigation/native-stack';

import type {
  RootStackParamList
} from '../types/navigation';

import { useApp } from '../contexts/AppContext';
import { COLORS } from '../styles/theme';

type Screen = 'Home' | 'Menu' | 'Cart';

export default function BottomNav({
  active
}: {
  active: Screen;
}) {
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();

  const { cartCount } = useApp();

  const items = [
    {
      label: 'Início',
      screen: 'Home' as const,
      icon: 'home-outline' as const
    },
    {
      label: 'Cardápio',
      screen: 'Menu' as const,
      icon: 'grid-outline' as const
    },
    {
      label: 'Carrinho',
      screen: 'Cart' as const,
      icon: 'cart-outline' as const
    }
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = active === item.screen;

        return (
          <Pressable
            key={item.screen}
            style={styles.button}
            accessibilityRole="button"
            onPress={() => {
              if (item.screen === 'Home') {
                navigation.navigate('Home');
              } else if (item.screen === 'Menu') {
                navigation.navigate('Menu');
              } else {
                navigation.navigate('Cart');
              }
            }}
          >
            <View>
              <Ionicons
                name={item.icon}
                size={24}
                color={
                  selected
                    ? COLORS.primary
                    : COLORS.textSecondary
                }
              />

              {item.screen === 'Cart' &&
                cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
            </View>

            <Text
              style={[
                styles.label,
                selected && styles.activeLabel
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    paddingBottom: 8
  },

  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },

  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },

  activeLabel: {
    color: COLORS.primary,
    fontWeight: '800'
  },

  badge: {
    position: 'absolute',
    right: -14,
    top: -7,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});