import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';
import { COLORS } from '../styles/theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupOrder'>;

export default function GroupOrderScreen({ navigation }: Props) {
  const { cart, cartTotal } = useApp();
  const [feedback, setFeedback] = useState('');
  const hasItems = cart.length > 0;

  const summary = [
    'Bah, que Fome!! · Pedido em grupo',
    '',
    ...cart.map(({ product, quantity }) =>
      `${quantity}× ${product.name} — ${formatPrice(product.price * quantity)}`
    ),
    '',
    `Subtotal: ${formatPrice(cartTotal)}`,
    'A taxa de entrega, se aplicável, é calculada na finalização.',
  ].join('\n');

  async function shareSummary() {
    setFeedback('');

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({ text: summary });
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(summary);
          setFeedback('Resumo copiado. Você pode colar no WhatsApp.');
        } else {
          setFeedback('Selecione o resumo abaixo para copiá-lo.');
        }
        return;
      }

      await Share.share({ message: summary }, { dialogTitle: 'Compartilhar pedido em grupo' });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setFeedback('Não foi possível compartilhar. Você pode selecionar e copiar o resumo.');
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>Pedido em grupo</Text>
        <Text style={styles.body}>
          Compartilhe os itens e o subtotal. A finalização fica neste carrinho.
        </Text>
        {hasItems ? (
          <>
            <View style={styles.summary}>
              <Text selectable style={styles.summaryText}>{summary}</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={shareSummary} style={styles.button}>
              <Text style={styles.buttonText}>Compartilhar resumo</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Cart')} style={styles.link}>
              <Text style={styles.linkText}>Abrir carrinho</Text>
            </Pressable>
            {feedback !== '' && <Text accessibilityLiveRegion="polite" style={styles.body}>{feedback}</Text>}
          </>
        ) : (
          <>
            <Text style={styles.body}>Seu carrinho está vazio. Adicione itens para compartilhar.</Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Categories')} style={styles.button}>
              <Text style={styles.buttonText}>Ver cardápio</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, gap: 14 },
  back: { alignSelf: 'flex-start', padding: 8 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  body: { fontSize: 14, lineHeight: 21, color: COLORS.textSecondary },
  summary: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  summaryText: { color: COLORS.text, fontSize: 15, lineHeight: 23 },
  button: { backgroundColor: COLORS.primary, alignItems: 'center', padding: 15, borderRadius: 12 },
  buttonText: { color: COLORS.surface, fontWeight: '700' },
  link: { alignItems: 'center', padding: 12 },
  linkText: { color: COLORS.primary, fontWeight: '700' },
});
