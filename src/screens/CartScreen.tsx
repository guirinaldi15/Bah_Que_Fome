import React from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import type {
  NativeStackScreenProps
} from '@react-navigation/native-stack';

import type {
  RootStackParamList
} from '../types/navigation';

import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';
import ProductPhoto from '../components/ProductPhoto';
import { COLORS } from '../styles/theme';
import BottomNav from '../components/BottomNav';

type Props =
  NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function CartScreen({
  navigation
}: Props) {
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart
  } = useApp();

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Meu carrinho
        </Text>

        <Text style={styles.subtitle}>
          {cartCount}{' '}
          {cartCount === 1 ? 'item' : 'itens'}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="cart-outline"
            color={COLORS.primary}
            size={75}
          />

          <Text style={styles.emptyTitle}>
            Seu carrinho está vazio
          </Text>

          <Text style={styles.subtitle}>
            Escolha pratos no nosso cardápio.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.buttonText}>
              Explorar cardápio
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.list}
          >
            {cart.map((item) => (
              <View
                key={item.product.id}
                style={styles.card}
              >
                <ProductPhoto
                  product={item.product}
                  style={styles.photo}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {item.product.name}
                  </Text>

                  <Text style={styles.price}>
                    {formatPrice(item.product.price)}
                  </Text>

                  <View style={styles.actions}>
                    <Pressable
                      style={styles.round}
                      onPress={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                    >
                      <Ionicons
                        name="remove"
                        size={20}
                        color={COLORS.primary}
                      />
                    </Pressable>

                    <Text style={styles.quantity}>
                      {item.quantity}
                    </Text>

                    <Pressable
                      style={styles.round}
                      onPress={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={COLORS.primary}
                      />
                    </Pressable>

                    <Pressable
                      style={styles.remove}
                      onPress={() =>
                        removeFromCart(item.product.id)
                      }
                      accessibilityLabel={`Remover ${item.product.name}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        color={COLORS.danger}
                        size={21}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => navigation.navigate('Menu')}
              style={styles.more}
            >
              <Ionicons
                name="add-circle-outline"
                size={21}
                color={COLORS.primary}
              />

              <Text style={styles.moreText}>
                Adicionar mais produtos
              </Text>
            </Pressable>
          </ScrollView>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>
              Resumo do pedido
            </Text>

            <View style={styles.line}>
              <Text style={styles.subtitle}>
                Subtotal
              </Text>

              <Text style={styles.linePrice}>
                {formatPrice(cartTotal)}
              </Text>
            </View>

            <Text style={styles.note}>
              Taxa de entrega definida na próxima tela
              (simulação).
            </Text>

            <View style={styles.divider} />

            <View style={styles.line}>
              <Text style={styles.totalLabel}>
                Total dos produtos
              </Text>

              <Text style={styles.totalPrice}>
                {formatPrice(cartTotal)}
              </Text>
            </View>

            <Pressable
              style={styles.button}
              onPress={() =>
                navigation.navigate('Checkout')
              }
            >
              <Text style={styles.buttonText}>
                Finalizar pedido
              </Text>
            </Pressable>
          </View>
        </>
      )}

      <BottomNav active="Cart" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  header: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },

  title: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800'
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 5
  },

  list: {
    padding: 16,
    paddingBottom: 25
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 11
  },

  photo: {
    width: 88,
    height: 95,
    borderRadius: 11
  },

  name: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text
  },

  price: {
    marginTop: 5,
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 14
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 13
  },

  round: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F1E9',
    justifyContent: 'center',
    alignItems: 'center'
  },

  quantity: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15
  },

  remove: {
    marginLeft: 'auto',
    padding: 6
  },

  more: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 14
  },

  moreText: {
    color: COLORS.primary,
    fontWeight: '700'
  },

  summary: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 18
  },

  summaryTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 13
  },

  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  linePrice: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14
  },

  note: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 13
  },

  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 15
  },

  totalLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800'
  },

  totalPrice: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800'
  },

  button: {
    backgroundColor: COLORS.primary,
    marginTop: 17,
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    gap: 10
  },

  emptyTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 20
  }
});