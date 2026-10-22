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
import { COLORS } from '../styles/theme';
import { formatPrice } from '../data/products';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderTracking'
>;

export default function OrderTrackingScreen({
  navigation
}: Props) {
  const {
    activeOrder,
    advanceOrder
  } = useApp();

  const stages =
    activeOrder?.delivery.mode === 'pickup'
      ? [
          'Pedido confirmado',
          'Preparação iniciada',
          'Pronto para retirada',
          'Pedido retirado'
        ]
      : [
          'Pedido confirmado',
          'Preparação iniciada',
          'Produto finalizado',
          'Saiu para entrega',
          'Pedido entregue'
        ];

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.empty}>
          <Text style={styles.title}>
            Ainda não há pedido simulado.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate('Home')
            }
          >
            <Text style={styles.buttonText}>
              Voltar ao início
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const finished =
    activeOrder.statusIndex === stages.length - 1;

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.primary}
          />
        </Pressable>

        <View
          style={{
            flex: 1,
            marginLeft: 14
          }}
        >
          <Text style={styles.title}>
            Acompanhar pedido
          </Text>

          <Text style={styles.subtitle}>
            {activeOrder.id} · {activeOrder.createdAt}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.banner}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.bannerText}>
            Demonstração: o status só avança quando
            você tocar no botão abaixo. Não existe
            acompanhamento em tempo real.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Status do pedido
          </Text>

          {stages.map((stage, index) => (
            <View
              key={stage}
              style={styles.stage}
            >
              <Ionicons
                name={
                  index < activeOrder.statusIndex
                    ? 'checkmark-circle'
                    : index === activeOrder.statusIndex
                      ? 'radio-button-on'
                      : 'ellipse-outline'
                }
                size={24}
                color={
                  index <= activeOrder.statusIndex
                    ? COLORS.primary
                    : '#C9CECA'
                }
              />

              <Text
                style={[
                  styles.stageText,
                  index <= activeOrder.statusIndex &&
                    styles.stageActive
                ]}
              >
                {stage}
              </Text>

              {index === activeOrder.statusIndex && (
                <Text style={styles.now}>
                  {finished ? 'Concluído' : 'Atual'}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Informações do pedido
          </Text>

          {activeOrder.items.map((item) => (
            <Text
              key={item.product.id}
              style={styles.info}
            >
              {item.quantity}x {item.product.name}
            </Text>
          ))}

          <Text style={styles.total}>
            Total: {formatPrice(activeOrder.total)}
          </Text>

          <Text style={styles.info}>
            {activeOrder.delivery.mode === 'delivery'
              ? 'Entrega simulada'
              : 'Retirada simulada'}
          </Text>
        </View>

        {!finished && (
          <Pressable
            style={styles.button}
            onPress={advanceOrder}
          >
            <Text style={styles.buttonText}>
              Simular próxima etapa
            </Text>
          </Pressable>
        )}

        {finished && (
          <Text style={styles.complete}>
            Fluxo de pedido concluído! ✓
          </Text>
        )}

        <Pressable
          style={styles.link}
          onPress={() =>
            navigation.navigate('Home')
          }
        >
          <Text style={styles.linkText}>
            Voltar ao início
          </Text>
        </Pressable>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3
  },

  content: {
    padding: 18,
    paddingBottom: 30
  },

  banner: {
    backgroundColor: '#E7F1E8',
    borderRadius: 13,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15
  },

  bannerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    lineHeight: 18
  },

  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 17,
    marginBottom: 15
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14
  },

  stage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12
  },

  stageText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14
  },

  stageActive: {
    color: COLORS.primary,
    fontWeight: '700'
  },

  now: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700'
  },

  info: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 9
  },

  total: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '800',
    marginVertical: 8
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 9
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '800'
  },

  link: {
    alignItems: 'center',
    padding: 17
  },

  linkText: {
    fontWeight: '700',
    color: COLORS.primary
  },

  complete: {
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 20
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    gap: 20
  }
});