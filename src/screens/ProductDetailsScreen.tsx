import React, { useState } from 'react';

import {
  Image,
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
import { PRODUCTS, formatPrice } from '../data/products';
import { PRODUCT_DETAILS } from '../data/productDetails';
import { getProductImage } from '../data/productImages';
import { COLORS } from '../styles/theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

export default function ProductDetailsScreen({
  navigation,
  route
}: Props) {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find(
    (item) => item.id === route.params.productId
  );

  if (!product) {
    return (
      <SafeAreaView style={styles.page}>
        <Text style={styles.name}>
          Produto não encontrado.
        </Text>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.price}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const details = PRODUCT_DETAILS[product.id];

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.primary}
          />

          <Text style={styles.backText}>
            Voltar ao cardápio
          </Text>
        </Pressable>

        <Image
          source={getProductImage(product.id)}
          style={styles.hero}
          resizeMode="cover"
        />

        <Text style={styles.category}>
          {product.category.toUpperCase()}
        </Text>

        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {product.name}
          </Text>

          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
        </View>

        <Text style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.note}>
          <Ionicons
            name="people-outline"
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.noteText}>
            Serve: {details?.serves ?? 'Consultar'}
          </Text>
        </View>

        <Text style={styles.section}>
          Ingredientes
        </Text>

        {details?.ingredients.map((ingredient) => (
          <View
            key={ingredient}
            style={styles.ingredient}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.description}>
              {ingredient}
            </Text>
          </View>
        ))}

        <View
          style={[
            styles.note,
            { backgroundColor: '#FFF2DB' }
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={21}
            color={COLORS.amber}
          />

          <Text
            style={[
              styles.noteText,
              { color: '#72501B' }
            ]}
          >
            Ingredientes são ilustrativos.
            Não representam garantia de ausência
            de alérgenos.
          </Text>
        </View>

        <Text style={styles.section}>
          Origem
        </Text>

        <Text style={styles.description}>
          {details?.origin ?? 'Não informada'}
        </Text>

        <Text style={styles.section}>
          Curiosidade gastronômica
        </Text>

        <Text style={styles.description}>
          {details?.curiosity ?? 'Um sabor especial.'}
        </Text>

        <Text style={styles.section}>
          Quantidade
        </Text>

        <View style={styles.counter}>
          <Pressable
            style={styles.round}
            onPress={() =>
              setQuantity((q) => Math.max(1, q - 1))
            }
          >
            <Ionicons
              name="remove"
              size={21}
              color={COLORS.primary}
            />
          </Pressable>

          <Text style={styles.quantity}>
            {quantity}
          </Text>

          <Pressable
            style={styles.round}
            onPress={() =>
              setQuantity((q) => q + 1)
            }
          >
            <Ionicons
              name="add"
              size={21}
              color={COLORS.primary}
            />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalCaption}>
            Total
          </Text>

          <Text style={styles.totalValue}>
            {formatPrice(product.price * quantity)}
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            addToCart(product, quantity);
            navigation.navigate('Cart');
          }}
        >
          <Ionicons
            name="cart-outline"
            size={20}
            color="#FFF"
          />

          <Text style={styles.addText}>
            Adicionar ao carrinho
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 35
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16
  },

  backText: {
    color: COLORS.primary,
    fontWeight: '700'
  },

  hero: {
    width: '100%',
    height: 235,
    borderRadius: 17,
    backgroundColor: COLORS.muted
  },

  category: {
    color: COLORS.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '800',
    marginTop: 20
  },

  nameRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 5
  },

  name: {
    color: COLORS.text,
    fontSize: 24,
    flex: 1,
    fontWeight: '800'
  },

  price: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 17
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5
  },

  note: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    padding: 13,
    marginTop: 17,
    backgroundColor: '#E8F1E9',
    borderRadius: 12
  },

  noteText: {
    flex: 1,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18
  },

  section: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 23,
    marginBottom: 8
  },

  ingredient: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
    paddingVertical: 4
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22
  },

  round: {
    backgroundColor: '#E8F1E9',
    height: 43,
    width: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },

  quantity: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: '800'
  },

  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },

  totalCaption: {
    fontSize: 11,
    color: COLORS.textSecondary
  },

  totalValue: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '800'
  },

  addButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },

  addText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800'
  }
});