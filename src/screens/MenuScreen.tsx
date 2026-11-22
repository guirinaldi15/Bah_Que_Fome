import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  FlatList,
  Image,
  Pressable,
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

import {
  CATEGORIES,
  PRODUCTS,
  formatPrice,
  matchesDietaryPreferences
} from '../data/products';

import { getProductImage } from '../data/productImages';
import { COLORS } from '../styles/theme';
import BottomNav from '../components/BottomNav';

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

type Props =
  NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({
  navigation,
  route
}: Props) {
  const {
    cuisine,
    setCuisine,
    addToCart,
    cartCount,
    dietaryRestrictions
  } = useApp();

  const [selectedCuisine, setSelectedCuisine] =
    useState<Cuisine>(
      route.params?.cuisine ?? cuisine
    );

  const [category, setCategory] =
    useState(route.params?.category ?? 'Todos');

  const [search, setSearch] =
    useState(route.params?.search ?? '');

  useEffect(() => {
    setSelectedCuisine(route.params?.cuisine ?? cuisine);
    setCategory(route.params?.category ?? 'Todos');
    setSearch(route.params?.search ?? '');
  }, [cuisine, route.params]);

  const color =
    selectedCuisine === 'italiana'
      ? COLORS.primary
      : COLORS.amber;

  const [dietaryFilter, setDietaryFilter] =
    useState<'all' | 'personal' | 'vegetarian' | 'lactose' | 'gluten'>('all');
  const dietaryFilters = [
    ['all', 'Todos'],
    ['personal', 'Adequados para mim'],
    ['vegetarian', 'Vegetarianos'],
    ['lactose', 'Sem lactose'],
    ['gluten', 'Sem glúten'],
  ] as const;
  const globalSearch = route.params?.cuisine === undefined && Boolean(route.params?.search);
  const products = useMemo(
    () =>
      PRODUCTS.filter(
        (product) =>
          (product.cuisine === selectedCuisine || (globalSearch && category === 'Todos' && Boolean(search.trim()))) &&
          (
            category === 'Todos' ||
            product.category === category
          ) &&
          matchesDietaryPreferences(product,
            dietaryFilter === 'all' ? [] :
              dietaryFilter === 'personal' ? dietaryRestrictions : [dietaryFilter]
          ) &&
          normalizeSearch(`${product.name} ${product.description}`)
            .includes(normalizeSearch(search.trim()))
      ),
    [selectedCuisine, category, search, globalSearch, dietaryFilter, dietaryRestrictions]
  );

  function changeCuisine(next: Cuisine) {
    navigation.setParams({ cuisine: next, category: 'Todos', search: '' });
    setCuisine(next);
  }

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: color }
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            Nosso cardápio
          </Text>

          <Text style={styles.headerSubtitle}>
            Escolha seus pratos favoritos
          </Text>
        </View>

        <Pressable
          style={{ padding: 10 }}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons
            name="cart-outline"
            color="#FFF"
            size={26}
          />

          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.switchRow}>
        {([
          ['italiana', '🇮🇹 Cucina Italiana'],
          ['choperia', '🇧🇷 Choperia Brasileira']
        ] as [Cuisine, string][]).map(
          ([id, label]) => (
            <Pressable
              key={id}
              style={[
                styles.switch,
                selectedCuisine === id && {
                  backgroundColor: color
                }
              ]}
              onPress={() => changeCuisine(id)}
            >
              <Text
                style={[
                  styles.switchText,
                  selectedCuisine === id && {
                    color: '#FFF'
                  }
                ]}
              >
                {label}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <View style={styles.search}>
        <Ionicons
          name="search-outline"
          color={COLORS.textSecondary}
          size={19}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto"
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons
              name="close-circle"
              size={21}
              color={COLORS.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.chips}>
        {CATEGORIES[selectedCuisine].map(
          (item) => (
            <Pressable
              key={item}
              style={[
                styles.chip,
                category === item && {
                  backgroundColor: color,
                  borderColor: color
                }
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item && {
                    color: '#FFF'
                  }
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <View style={styles.chips}>
        {dietaryFilters.map(([value, label]) => (
          <Pressable key={value} accessibilityRole="button"
            accessibilityState={{ selected: dietaryFilter === value }}
            onPress={() => setDietaryFilter(value)}
            style={[styles.chip, dietaryFilter === value && { backgroundColor: color }]}>
            <Text style={[styles.chipText, dietaryFilter === value && { color: '#FFF' }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      {dietaryFilter !== 'all' && (
        <Text style={styles.empty}>Filtro baseado nas receitas cadastradas. Consulte o restaurante sobre alergias.</Text>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum produto encontrado nesta categoria.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.product}
            onPress={() =>
              navigation.navigate('ProductDetails', {
                productId: item.id
              })
            }
          >
            <Image
              source={getProductImage(item.id)}
              style={styles.photo}
            />

            <View
              style={{
                flex: 1,
                justifyContent: 'space-between'
              }}
            >
              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {item.description}
              </Text>

              <View style={styles.productBottom}>
                <Text
                  style={[
                    styles.price,
                    { color }
                  ]}
                >
                  {formatPrice(item.price)}
                </Text>

                <Pressable
                  accessibilityLabel={`Adicionar ${item.name}`}
                  style={[
                    styles.add,
                    { backgroundColor: color }
                  ]}
                  onPress={() => addToCart(item)}
                >
                  <Ionicons
                    name="add"
                    color="#FFF"
                    size={23}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      <BottomNav active="Menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800'
  },

  headerSubtitle: {
    color: '#F0F1ED',
    fontSize: 12,
    marginTop: 5
  },

  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 11,
    paddingHorizontal: 5,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800'
  },

  switchRow: {
    flexDirection: 'row',
    margin: 15,
    gap: 9
  },

  switch: {
    backgroundColor: COLORS.muted,
    flex: 1,
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: 'center'
  },

  switchText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text
  },

  search: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 47,
    gap: 8
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginHorizontal: 15,
    marginVertical: 13
  },

  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 18
  },

  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text
  },

  list: {
    paddingHorizontal: 15,
    paddingBottom: 25,
    flexGrow: 1
  },

  product: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12
  },

  photo: {
    width: 95,
    height: 95,
    borderRadius: 11
  },

  name: {
    fontWeight: '800',
    color: COLORS.text,
    fontSize: 14
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
    lineHeight: 17
  },

  productBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9
  },

  price: {
    fontSize: 15,
    fontWeight: '800'
  },

  add: {
    width: 33,
    height: 33,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center'
  },

  empty: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 35
  }
});