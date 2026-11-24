import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BottomNav from '../components/BottomNav';
import DietaryRestrictionsSelector from '../components/DietaryRestrictionsSelector';
import { useApp } from '../contexts/AppContext';
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products';
import type { Product } from '../data/products';
import ProductPhoto from '../components/ProductPhoto';
import { COLORS } from '../styles/theme';
import type { Cuisine, RootStackParamList } from '../types/navigation';

type ExploreRoute = 'Categories' | 'BuildMeal' | 'Profile';

function Screen({ active, title, children }: { active: ExploreRoute; title: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {children}
      </ScrollView>
      <BottomNav active={active} />
    </SafeAreaView>
  );
}

function Row({ label, detail, onPress, selected }: {
  label: string;
  detail?: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }}
      onPress={onPress} style={[styles.row, selected && styles.selected]}>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{label}</Text>
        {detail && <Text style={styles.secondary}>{detail}</Text>}
      </View>
      <Ionicons name={selected ? 'checkmark' : 'chevron-forward'} size={20} color={COLORS.primary} />
    </Pressable>
  );
}

export function CategoriesScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Categories'>) {
  const { cuisine, setCuisine } = useApp();

  useEffect(() => {
    if (route.params?.cuisine) setCuisine(route.params.cuisine);
  }, [route.params?.cuisine, setCuisine]);

  function selectCuisine(next: Cuisine) {
    navigation.setParams({ cuisine: next });
    setCuisine(next);
  }

  return (
    <Screen active="Categories" title="Categorias">
      <Row label="Cucina Italiana" selected={cuisine === 'italiana'} onPress={() => selectCuisine('italiana')} />
      <Row label="Choperia Brasileira" selected={cuisine === 'choperia'} onPress={() => selectCuisine('choperia')} />
      <View style={styles.grid}>
        {CATEGORIES[cuisine].map(category => (
          <Pressable key={category} style={styles.tile} accessibilityRole="button"
            onPress={() => navigation.navigate('Menu', { cuisine, category, search: '' })}>
            <Ionicons name="restaurant-outline" size={22} color={COLORS.primary} />
            <Text style={styles.label}>{category === 'Todos' ? 'Ver cardápio completo' : category}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const mealCourses = [
  { label: '🥗 Entrada', categories: ['Entradas', 'Saladas', 'Porções'] },
  { label: '🍝 Prato principal', categories: ['Pizzas', 'Massas', 'Risotos'] },
  { label: '🍺 Bebida', categories: ['Chopp', 'Drinks', 'Bebidas'] },
  { label: '🍰 Sobremesa', categories: ['Sobremesas'] },
];

export function BuildMealScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'BuildMeal'>) {
  const { addToCart } = useApp();
  const [expanded, setExpanded] = useState<string>();
  const [choices, setChoices] = useState<Partial<Record<string, Product>>>({});
  const items = Object.values(choices).filter((product): product is Product => product !== undefined);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  function addMeal() {
    items.forEach(product => addToCart(product));
    setChoices({});
    setExpanded(undefined);
    navigation.navigate('Cart');
  }

  return (
    <Screen active="BuildMeal" title="Montar Refeição">
      <Text style={styles.secondary}>Monte sua experiência completa</Text>
      {mealCourses.map(course => {
        const chosen = choices[course.label];
        return (
          <View key={course.label} style={styles.course}>
            <Row label={course.label} detail={chosen?.name ?? 'Toque para escolher'}
              onPress={() => setExpanded(expanded === course.label ? undefined : course.label)} />
            {expanded === course.label && (
              <>
                {PRODUCTS.filter(product => course.categories.includes(product.category)).map(product => (
                  <Pressable key={product.id} style={[styles.row, chosen?.id === product.id && styles.selected]}
                    accessibilityRole="button" accessibilityState={{ selected: chosen?.id === product.id }}
                    onPress={() => {
                      setChoices(previous => ({ ...previous, [course.label]: product }));
                      setExpanded(undefined);
                    }}>
                    <ProductPhoto product={product} style={styles.image} />
                    <View style={styles.rowContent}>
                      <Text style={styles.label}>{product.name}</Text>
                      <Text style={styles.secondary}>{formatPrice(product.price)}</Text>
                    </View>
                  </Pressable>
                ))}
                {chosen && <Row label="Remover escolha" onPress={() => {
                  setChoices(previous => ({ ...previous, [course.label]: undefined }));
                  setExpanded(undefined);
                }} />}
              </>
            )}
          </View>
        );
      })}
      <Pressable accessibilityRole="button" disabled={items.length === 0}
        onPress={addMeal} style={[styles.button, items.length === 0 && styles.disabled]}>
        <Text style={styles.buttonText}>Adicionar ao carrinho · {formatPrice(total)}</Text>
      </Pressable>
    </Screen>
  );
}

export function ProfileScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Profile'>) {
  const { userName, orders, dietaryRestrictions, saveDietaryRestrictions, signOut } = useApp();

  return (
    <Screen active="Profile" title="Perfil">
      <Text style={styles.label}>{userName}</Text>
      <DietaryRestrictionsSelector selected={dietaryRestrictions} onChange={saveDietaryRestrictions} />
      <Text accessibilityRole="header" style={styles.label}>Meus pedidos</Text>
      {orders.length === 0 && <Text style={styles.secondary}>Nenhum pedido nesta sessão.</Text>}
      {orders.map(order => (
        <Row key={order.id} label={order.items.map(item => item.product.name).join(', ')}
          detail={`${order.createdAt} · ${formatPrice(order.total)}`}
          onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })} />
      ))}
      <Row label="Pedido em grupo" onPress={() => navigation.navigate('GroupOrder')} />
      <Row label="Sair" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, gap: 12 },
  title: { fontFamily: 'serif', color: COLORS.text, fontSize: 29, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, backgroundColor: COLORS.surface,
  },
  selected: { borderColor: COLORS.primary, backgroundColor: '#EAF2EC' },
  rowContent: { flex: 1, gap: 3 },
  label: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  secondary: { color: COLORS.textSecondary, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    flexBasis: '47%', flexGrow: 1, minHeight: 90, padding: 14, gap: 9,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
  },
  course: { gap: 8 },
  image: { width: 48, height: 48, borderRadius: 8 },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 14, alignItems: 'center' },
  disabled: { opacity: 0.45 },
  buttonText: { color: COLORS.surface, fontWeight: '700' },
});
