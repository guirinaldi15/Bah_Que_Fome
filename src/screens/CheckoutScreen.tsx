import React, { useRef, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import type {
  NativeStackScreenProps
} from '@react-navigation/native-stack';

import type {
  RootStackParamList
} from '../types/navigation';

import {
  useApp,
  DELIVERY_FEE
} from '../contexts/AppContext';

import type {
  DeliveryMode,
  LocationType,
  MockOrder,
  PaymentMethod
} from '../contexts/AppContext';

import { COLORS } from '../styles/theme';
import { formatPrice } from '../data/products';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Checkout'
>;

type Step = 'delivery' | 'payment' | 'confirmed';

const brazilianStates: Record<string, string> = {
  acre: 'AC', alagoas: 'AL', amapa: 'AP', amazonas: 'AM', bahia: 'BA',
  ceara: 'CE', 'distrito federal': 'DF', 'espirito santo': 'ES',
  goias: 'GO', maranhao: 'MA', 'mato grosso': 'MT',
  'mato grosso do sul': 'MS', 'minas gerais': 'MG', para: 'PA',
  paraiba: 'PB', parana: 'PR', pernambuco: 'PE', piaui: 'PI',
  'rio de janeiro': 'RJ', 'rio grande do norte': 'RN',
  'rio grande do sul': 'RS', rondonia: 'RO', roraima: 'RR',
  'santa catarina': 'SC', 'sao paulo': 'SP', sergipe: 'SE', tocantins: 'TO',
};

function findStateCode(region: string | null) {
  const normalized = region?.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .trim().toLowerCase().replace(/^estado de /, '').replace(/^br-/, '') ?? '';
  const code = normalized.toUpperCase();
  return Object.values(brazilianStates).includes(code) ? code : brazilianStates[normalized] ?? '';
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'pix',
    label: 'PIX (simulado)',
    icon: 'qr-code-outline'
  },
  {
    id: 'credit',
    label: 'Cartão de crédito (simulado)',
    icon: 'card-outline'
  },
  {
    id: 'debit',
    label: 'Cartão de débito (simulado)',
    icon: 'card-outline'
  },
  {
    id: 'cash',
    label: 'Dinheiro (simulado)',
    icon: 'cash-outline'
  },
  {
    id: 'wallet',
    label: 'Carteira digital (simulada)',
    icon: 'wallet-outline'
  }
];

export default function CheckoutScreen({
  navigation
}: Props) {
  const {
    cart,
    cartTotal,
    delivery,
    setDelivery,
    placeOrder
  } = useApp();

  const [step, setStep] =
    useState<Step>('delivery');

  const [payment, setPayment] =
    useState<PaymentMethod>('pix');

  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<MockOrder | null>(null);
  const submittedOrder = useRef(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const locationRequest = useRef(0);
  const pendingLocation = useRef(false);

  const fee =
    delivery.mode === 'delivery'
      ? DELIVERY_FEE
      : 0;

  function patch(
    field: keyof typeof delivery,
    value: string
  ) {
    if (field === 'mode' && value !== delivery.mode) {
      cancelLocationLookup();
    }

    setDelivery((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  function cancelLocationLookup() {
    ++locationRequest.current;
    pendingLocation.current = false;
    setLocating(false);
    setLocationMessage('');
  }

  async function fillAddressFromLocation() {
    if (pendingLocation.current) return;
    const request = ++locationRequest.current;
    const isCurrent = () => request === locationRequest.current && navigation.isFocused();

    pendingLocation.current = true;
    setLocating(true);
    setLocationMessage('');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!isCurrent()) return;
      if (!permission.granted) {
        setLocationMessage('Permissão de localização negada. Preencha o endereço manualmente.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!isCurrent()) return;
      const [address] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      if (!isCurrent()) return;

      if (!address || (address.isoCountryCode && address.isoCountryCode !== 'BR')) {
        setLocationMessage('Não foi encontrado um endereço no Brasil. Preencha os campos manualmente.');
        return;
      }

      setDelivery(previous => ({
        ...previous,
        cep: previous.cep.trim() ? previous.cep : address.postalCode ?? '',
        street: previous.street.trim() ? previous.street : address.street ?? '',
        district: previous.district.trim() ? previous.district : address.district ?? '',
        city: previous.city.trim() ? previous.city : address.city ?? '',
        state: previous.state.trim() ? previous.state : findStateCode(address.region),
      }));
      setLocationMessage('Confira os campos preenchidos e informe o número e o complemento.');
    } catch {
      if (isCurrent()) {
        setLocationMessage('Não foi possível localizar seu endereço. Preencha os campos manualmente.');
      }
    } finally {
      if (request === locationRequest.current) {
        pendingLocation.current = false;
        if (navigation.isFocused()) setLocating(false);
      }
    }
  }

  function advanceToPayment() {
    if (
      !delivery.name.trim() ||
      !delivery.phone.trim()
    ) {
      setError('Informe seu nome e telefone.');
      return;
    }

    if (
      delivery.mode === 'delivery' &&
      (
        !delivery.street.trim() ||
        !delivery.number.trim() ||
        !delivery.district.trim() ||
        !delivery.city.trim() ||
        !/^[a-z]{2}$/i.test(delivery.state.trim())
      )
    ) {
      setError(
        'Preencha rua, número, bairro, cidade e UF para a entrega.'
      );
      return;
    }

    const phoneDigits = delivery.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      setError('Informe um telefone válido com DDD.');
      return;
    }

    if (
      delivery.mode === 'delivery' &&
      (delivery.locationType === 'hotel' || delivery.locationType === 'pousada') &&
      !delivery.establishment.trim()
    ) {
      setError('Informe o nome do hotel ou da pousada.');
      return;
    }

    setError('');
    cancelLocationLookup();
    setStep('payment');
  }

  function finishOrder() {
    if (submittedOrder.current) return;
    const order = placeOrder(payment);
    if (!order) {
      Alert.alert(
        'Carrinho vazio',
        'Adicione produtos antes de finalizar.'
      );
      return;
    }

    submittedOrder.current = true;
    setConfirmedOrder(order);
    setStep('confirmed');
  }

  function field(
    label: string,
    key: keyof typeof delivery,
    placeholder = ''
  ) {
    return (
      <View style={styles.field} key={key}>
        <Text style={styles.label}>
          {label}
        </Text>

        <TextInput
          style={styles.input}
          value={String(delivery[key])}
          onChangeText={(value) => patch(key, value)}
          placeholder={placeholder || label}
          placeholderTextColor="#969696"
          autoCapitalize={
            key === 'phone' || key === 'cep'
              ? 'none'
              : 'sentences'
          }
          keyboardType={
            key === 'phone'
              ? 'phone-pad'
              : key === 'cep'
                ? 'number-pad'
                : 'default'
          }
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.page}
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <Pressable
          disabled={step === 'confirmed'}
          onPress={() =>
            step === 'payment'
              ? setStep('delivery')
              : navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primary}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          {step === 'delivery'
            ? 'Entrega ou retirada'
            : step === 'payment'
              ? 'Pagamento'
              : 'Pedido confirmado'}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {step === 'delivery' && (
            <>
              <Text style={styles.heading}>
                Como deseja receber?
              </Text>

              <View style={styles.choiceRow}>
                {([
                  [
                    'delivery',
                    'Entrega',
                    'bicycle-outline'
                  ],
                  [
                    'pickup',
                    'Retirada',
                    'storefront-outline'
                  ]
                ] as const).map(
                  ([value, label, icon]) => (
                    <Pressable
                      key={value}
                      style={[
                        styles.choice,
                        delivery.mode === value &&
                          styles.selected
                      ]}
                      onPress={() =>
                        patch(
                          'mode',
                          value as DeliveryMode
                        )
                      }
                    >
                      <Ionicons
                        name={icon}
                        size={26}
                        color={COLORS.primary}
                      />

                      <Text style={styles.choiceText}>
                        {label}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>

              <View style={styles.note}>
                <Ionicons
                  name="time-outline"
                  size={19}
                  color={COLORS.primary}
                />

                <Text style={styles.noteText}>
                  {delivery.mode === 'delivery'
                    ? 'Previsão ilustrativa: cerca de 45 minutos. Taxa simulada de R$ 12,00.'
                    : 'Previsão ilustrativa: cerca de 30 minutos. Sem taxa de entrega.'}
                </Text>
              </View>

              <Text style={styles.heading}>
                Dados de contato
              </Text>

              {field('Nome completo', 'name')}
              {field(
                'Telefone',
                'phone',
                '(00) 00000-0000'
              )}

              {delivery.mode === 'delivery' && (
                <>
                  <Text style={styles.heading}>
                    Endereço de entrega
                  </Text>

                  {Platform.OS !== 'web' && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ busy: locating, disabled: locating }}
                      disabled={locating}
                      onPress={fillAddressFromLocation}
                      style={styles.locationButton}
                    >
                      <Ionicons name="locate-outline" size={20} color={COLORS.primary} />
                      <Text style={styles.noteText}>
                        {locating ? 'Buscando endereço…' : 'Usar minha localização'}
                      </Text>
                    </Pressable>
                  )}
                  {locationMessage !== '' && (
                    <Text accessibilityLiveRegion="polite" style={styles.small}>
                      {locationMessage}
                    </Text>
                  )}

                  <Text style={styles.label}>
                    Tipo de local
                  </Text>

                  <View style={styles.chips}>
                    {([
                      ['residencia', 'Residência'],
                      ['hotel', 'Hotel'],
                      ['pousada', 'Pousada'],
                      ['turistico', 'Ponto turístico'],
                      ['other', 'Outro']
                    ] as [LocationType, string][]).map(
                      ([value, label]) => (
                        <Pressable
                          key={value}
                          style={[
                            styles.chip,
                            delivery.locationType ===
                              value &&
                              styles.chipSelected
                          ]}
                          onPress={() =>
                            patch('locationType', value)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              delivery.locationType ===
                                value &&
                                styles.chipTextSelected
                            ]}
                          >
                            {label}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>

                  {field(
                    'CEP (preenchimento manual)',
                    'cep',
                    '00000-000'
                  )}

                  {field('Rua / avenida', 'street')}
                  {field('Número', 'number')}
                  {field('Bairro', 'district')}

                  {field('Cidade', 'city', 'Ex.: Presidente Epitácio')}
                  {field('UF', 'state', 'Ex.: SP')}

                  {field(
                    'Complemento (opcional)',
                    'complement'
                  )}

                  {field(
                    'Ponto de referência (opcional)',
                    'reference'
                  )}

                  {(
                    delivery.locationType === 'hotel' ||
                    delivery.locationType === 'pousada'
                  ) && (
                    <>
                      {field(
                        'Nome do hotel / pousada',
                        'establishment'
                      )}

                      {field(
                        'Número do quarto (opcional)',
                        'room'
                      )}
                    </>
                  )}

                  {field(
                    'Instruções para entrega (opcional)',
                    'instructions',
                    'Ex.: deixar na recepção'
                  )}
                </>
              )}

              {error !== '' && (
                <Text style={styles.error}>
                  {error}
                </Text>
              )}

              <Pressable
                style={styles.button}
                onPress={advanceToPayment}
              >
                <Text style={styles.buttonText}>
                  Continuar para pagamento
                </Text>
              </Pressable>
            </>
          )}

          {step === 'payment' && (
            <>
              <Text style={styles.heading}>
                Forma de pagamento
              </Text>

              <Text style={styles.small}>
                Escolha apenas para demonstrar o
                fluxo. Não haverá cobrança.
              </Text>

              {PAYMENT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.payment,
                    payment === option.id &&
                      styles.paymentSelected
                  ]}
                  onPress={() =>
                    setPayment(option.id)
                  }
                >
                  <Ionicons
                    name={option.icon}
                    size={23}
                    color={COLORS.primary}
                  />

                  <Text style={styles.paymentName}>
                    {option.label}
                  </Text>

                  <Ionicons
                    name={
                      payment === option.id
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={21}
                    color={COLORS.primary}
                  />
                </Pressable>
              ))}

              <View style={styles.note}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={COLORS.primary}
                />

                <Text style={styles.noteText}>
                  Não informe dados reais de cartão.
                  Nenhum pagamento ou PIX será realizado.
                </Text>
              </View>

              <Text style={styles.heading}>
                Resumo do pedido
              </Text>

              {cart.map((item) => (
                <View
                  key={item.product.id}
                  style={styles.line}
                >
                  <Text style={styles.lineLabel}>
                    {item.quantity}x {item.product.name}
                  </Text>

                  <Text style={styles.lineValue}>
                    {formatPrice(
                      item.product.price * item.quantity
                    )}
                  </Text>
                </View>
              ))}

              <View style={styles.line}>
                <Text style={styles.lineLabel}>
                  Subtotal
                </Text>

                <Text style={styles.lineValue}>
                  {formatPrice(cartTotal)}
                </Text>
              </View>

              <View style={styles.line}>
                <Text style={styles.lineLabel}>
                  Entrega (
                  {delivery.mode === 'pickup'
                    ? 'retirada'
                    : 'domicílio'}
                  )
                </Text>

                <Text style={styles.lineValue}>
                  {formatPrice(fee)}
                </Text>
              </View>

              <View
                style={[
                  styles.line,
                  styles.totalLine
                ]}
              >
                <Text style={styles.totalText}>
                  Total
                </Text>

                <Text style={styles.totalText}>
                  {formatPrice(cartTotal + fee)}
                </Text>
              </View>

              <Pressable
                style={styles.button}
                onPress={finishOrder}
              >
                <Text style={styles.buttonText}>
                  Confirmar pedido fictício
                </Text>
              </Pressable>
            </>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <View style={styles.successBox}>
              <Ionicons
                name="checkmark-circle"
                size={78}
                color={COLORS.primary}
              />

              <Text style={styles.successTitle}>
                Pedido confirmado!
              </Text>

              <Text style={styles.small}>
                Pedido de demonstração {confirmedOrder.id}
              </Text>

              <Text style={styles.small}>
                Total: {formatPrice(confirmedOrder.total)}
              </Text>

              <Text style={styles.small}>
                Não foi enviada uma compra real.
              </Text>

              <Pressable
                style={[
                  styles.button,
                  { alignSelf: 'stretch' }
                ]}
                onPress={() =>
                  navigation.navigate('OrderTracking', { orderId: confirmedOrder.id })
                }
              >
                <Text style={styles.buttonText}>
                  Acompanhar pedido
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate('Home')
                }
              >
                <Text style={styles.goHome}>
                  Voltar ao início
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: COLORS.muted,
    borderRadius: 12,
    marginBottom: 8,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  header: {
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },

  headerTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 17
  },

  content: {
    padding: 20,
    paddingBottom: 35,
    flexGrow: 1
  },

  heading: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 9,
    marginBottom: 15
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 12
  },

  choice: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    gap: 7,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: '#FFF'
  },

  selected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EDF4ED'
  },

  choiceText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700'
  },

  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    marginVertical: 17,
    backgroundColor: '#EAF2EC',
    borderRadius: 12
  },

  noteText: {
    flex: 1,
    color: COLORS.primary,
    lineHeight: 18,
    fontSize: 12
  },

  label: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6
  },

  field: {
    marginBottom: 14
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 11,
    height: 48,
    paddingHorizontal: 13,
    color: COLORS.text
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },

  chip: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10
  },

  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },

  chipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600'
  },

  chipTextSelected: {
    color: '#FFF'
  },

  error: {
    color: COLORS.danger,
    marginBottom: 12,
    fontWeight: '700'
  },

  button: {
    padding: 17,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800'
  },

  payment: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },

  paymentSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EDF4ED'
  },

  paymentName: {
    flex: 1,
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 13
  },

  small: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
    textAlign: 'center'
  },

  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },

  lineLabel: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13
  },

  lineValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700'
  },

  totalLine: {
    borderBottomWidth: 0,
    marginTop: 8
  },

  totalText: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary
  },

  successBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 60
  },

  successTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.primary
  },

  goHome: {
    color: COLORS.primary,
    padding: 15,
    fontWeight: '700'
  }
});