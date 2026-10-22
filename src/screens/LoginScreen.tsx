import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../contexts/AppContext';
import { COLORS } from '../styles/theme';

export default function LoginScreen() {
  const { signIn } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (
      !email.trim() ||
      !password.trim() ||
      (isRegister && !name.trim())
    ) {
      setError('Preencha os campos para continuar.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('A confirmação de senha deve ser igual à senha.');
      return;
    }

    setError('');

    const fallbackName =
      email.split('@')[0].trim() || 'Cliente';

    signIn(
      isRegister
        ? name.trim().split(' ')[0]
        : fallbackName
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandArea}>
            <Text style={styles.flags}>
              🇮🇹   🍝   🍺   🇧🇷
            </Text>

            <Text style={styles.logo}>
              Bah,{'\n'}que Fome!!
            </Text>

            <Text style={styles.subtitle}>
              CUCINA ITALIANA &{'\n'}
              CHOPERIA BRASILEIRA
            </Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.heading}>
              {isRegister
                ? 'Criar conta'
                : 'Bem-vindo de volta!'}
            </Text>

            <Text style={styles.helper}>
              {isRegister
                ? 'Cadastre-se para começar a pedir.'
                : 'Entre para explorar nosso cardápio.'}
            </Text>

            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#9D8E8B"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#9D8E8B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#9D8E8B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#9D8E8B"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            )}

            {error !== '' && (
              <Text style={styles.error}>
                {error}
              </Text>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={submit}
            >
              <Text style={styles.primaryText}>
                {isRegister ? 'Cadastrar' : 'Entrar'}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={COLORS.wine}
              />
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() =>
                setIsRegister((value) => !value)
              }
            >
              <Text style={styles.secondaryText}>
                {isRegister
                  ? 'Já tenho conta'
                  : 'Criar conta'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => signIn('Visitante')}
            style={styles.guestButton}
          >
            <Text style={styles.guestText}>
              Continuar como visitante
            </Text>

            <Ionicons
              name="chevron-forward"
              size={16}
              color="#FFF4DD"
            />
          </Pressable>

          <Text style={styles.demo}>
            Protótipo: acesso simulado,
            sem autenticação real.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.wine
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: 'center'
  },

  brandArea: {
    alignItems: 'center',
    marginBottom: 24
  },

  flags: {
    fontSize: 26,
    marginBottom: 14
  },

  logo: {
    fontFamily: Platform.OS === 'ios'
      ? 'Georgia'
      : 'serif',
    color: '#FFFFFF',
    fontSize: 52,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    lineHeight: 55
  },

  subtitle: {
    color: '#F7C976',
    letterSpacing: 3,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 16,
    lineHeight: 19
  },

  panel: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.10)',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)'
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700'
  },

  helper: {
    color: '#F4DAD6',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 18
  },

  input: {
    height: 49,
    backgroundColor: '#FFF7EE',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 15,
    color: COLORS.text
  },

  error: {
    color: '#FFF1AA',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center'
  },

  primaryButton: {
    height: 49,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },

  primaryText: {
    color: COLORS.wine,
    fontWeight: '800',
    fontSize: 15
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#F0C4B8',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  secondaryText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },

  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 23
  },

  guestText: {
    color: '#FFF4DD',
    fontSize: 14,
    textDecorationLine: 'underline'
  },

  demo: {
    color: '#EBC9C3',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 16
  },
});