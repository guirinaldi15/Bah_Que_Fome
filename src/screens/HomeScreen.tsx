import React, { useState } from 'react';

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import type {
  NativeStackScreenProps
} from '@react-navigation/native-stack';

import type {
  Cuisine,
  RootStackParamList
} from '../types/navigation';

import { useApp } from '../contexts/AppContext';
import { PRODUCTS, formatPrice, matchesDietaryPreferences } from '../data/products';
import { getProductImage } from '../data/productImages';
import { COLORS } from '../styles/theme';
import BottomNav from '../components/BottomNav';

type Props =
  NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({
  navigation
}: Props) {
  const { userName, activeOrder, setCuisine, dietaryRestrictions } = useApp();
  const [search, setSearch] = useState('');

  function openCuisine(next: Cuisine) {
    setCuisine(next);
    navigation.navigate('Categories', { cuisine: next });
  }

  const recommended = PRODUCTS
    .filter(product => dietaryRestrictions.length
      ? matchesDietaryPreferences(product, dietaryRestrictions)
      : product.cuisine === 'italiana')
    .slice(0, 5);

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.top}>
          <View>
            <Text style={styles.brand}>Bah, que Fome!!</Text>
            <Text style={styles.greeting}>
              Olá, {userName}!
            </Text>
          </View>

          <Pressable
            style={styles.logout}
            onPress={() => {
              if (activeOrder) {
                navigation.navigate('OrderTracking', { orderId: activeOrder.id });
              } else {
                navigation.navigate('Profile');
              }
            }}
            accessibilityLabel={activeOrder ? 'Acompanhar pedido' : 'Abrir perfil'}
          >
            <Ionicons
              name={activeOrder ? "receipt-outline" : "person-outline"}
              color={COLORS.secondary}
              size={22}
            />
          </Pressable>
        </View>

        <Text style={styles.heading}>
          Qual será o seu{'\n'}pedido hoje?
        </Text>

        <Text style={styles.subheading}>
          Escolha sua cozinha favorita.
        </Text>

        <View style={styles.search}>
          <Ionicons
            name="search-outline"
            color={COLORS.textSecondary}
            size={20}
          />

          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar pratos, bebidas ou sobremesas"
            placeholderTextColor={COLORS.textSecondary}
            onSubmitEditing={() =>
              navigation.navigate('Menu', { search })
            }
          />

          <Pressable
            onPress={() =>
              navigation.navigate('Menu', { search })
            }
          >
            <Ionicons
              name="arrow-forward-circle"
              size={24}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.banner,
            { backgroundColor: COLORS.primary }
          ]}
          onPress={() => openCuisine('italiana')}
        >
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerEyebrow}>
              SABORES DA ITÁLIA
            </Text>

            <Text style={styles.bannerTitle}>
              Cucina{'\n'}Italiana
            </Text>

            <Text style={styles.bannerLink}>
              Ver cardápio →
            </Text>
          </View>

          <Image
            source={getProductImage('4')}
            style={styles.bannerImage}
          />
        </Pressable>

        <Pressable
          style={[
            styles.banner,
            { backgroundColor: COLORS.amber }
          ]}
          onPress={() => openCuisine('choperia')}
        >
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerEyebrow}>
              SABORES DO BRASIL
            </Text>

            <Text style={styles.bannerTitle}>
              Choperia{'\n'}Brasileira
            </Text>

            <Text style={styles.bannerLink}>
              Ver cardápio →
            </Text>
          </View>

          <Image
            source={getProductImage('8')}
            style={styles.bannerImage}
          />
        </Pressable>

        <Pressable
          style={styles.feature}
          onPress={() => navigation.navigate('BuildMeal')}
          accessibilityRole="button"
        >
          <Ionicons
            name="restaurant-outline"
            size={27}
            color={COLORS.primary}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>
              Montar minha refeição
            </Text>

            <Text style={styles.muted}>
              Escolha entrada, prato principal, bebida e sobremesa.
            </Text>
          </View>
        </Pressable>

        <Text style={styles.section}>
          Recomendados para você
        </Text>

        {recommended.length === 0 && (
          <Text style={styles.muted}>O catálogo ainda não tem receitas classificadas para todas as suas restrições.</Text>
        )}
        {recommended.map((product) => (
          <Pressable
            key={product.id}
            style={styles.product}
            onPress={() =>
              navigation.navigate('ProductDetails', {
                productId: product.id
              })
            }
          >
            <Image
              source={getProductImage(product.id)}
              style={styles.productPhoto}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text
                style={styles.muted}
                numberOfLines={2}
              >
                {product.description}
              </Text>

              <Text style={styles.price}>
                {formatPrice(product.price)}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.primary}
            />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNav active="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 28
  },

  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },

  brand: {
    fontSize: 17,
    color: COLORS.primary,
    fontWeight: '800'
  },

  greeting: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.textSecondary
  },

  logout: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border
  },

  heading: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
    color: COLORS.text
  },

  subheading: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 18
  },

  search: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 8,
    marginBottom: 16
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: COLORS.text
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    minHeight: 150,
    borderRadius: 17,
    marginBottom: 13
  },

  bannerTextBox: {
    flex: 1,
    padding: 19,
    justifyContent: 'center'
  },

  bannerEyebrow: {
    color: '#FCE6B3',
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '700'
  },

  bannerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 27,
    marginTop: 6
  },

  bannerLink: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '700'
  },

  bannerImage: {
    width: '38%',
    minHeight: 150
  },

  feature: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#EAF2EC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 6
  },

  featureTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '800'
  },

  muted: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },

  section: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 13
  },

  product: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  productPhoto: {
    width: 72,
    height: 72,
    borderRadius: 11
  },

  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text
  },

  price: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5
  }
});