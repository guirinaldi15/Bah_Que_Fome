import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  DIETARY_OPTIONS,
  DietaryRestriction,
} from '../types/dietary';

type Props = {
  selected: DietaryRestriction[];
  onChange: (values: DietaryRestriction[]) => void;
};

export default function DietaryRestrictionsSelector({
  selected,
  onChange,
}: Props) {
  function toggle(value: DietaryRestriction) {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
      return;
    }

    onChange([...selected, value]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Você possui alguma restrição alimentar?
      </Text>

      <Text style={styles.subtitle}>
        Selecione todas as opções aplicáveis.
      </Text>

      {DIETARY_OPTIONS.map(option => {
        const active = selected.includes(option.value);

        return (
          <Pressable
            key={option.value}
            onPress={() => toggle(option.value)}
            style={[
              styles.option,
              active && styles.optionActive,
            ]}
          >
            <View style={[
              styles.checkbox,
              active && styles.checkboxActive,
            ]}>
              {active && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            <Text style={[
              styles.label,
              active && styles.labelActive,
            ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 12,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  subtitle: {
    color: '#F4DAD6',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: 10,
    padding: 11,
    marginBottom: 7,
  },

  optionActive: {
    backgroundColor: '#FFF7EE',
    borderColor: '#F7C976',
  },

  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxActive: {
    backgroundColor: '#6D2638',
    borderColor: '#6D2638',
  },

  checkmark: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
  },

  labelActive: {
    color: '#6D2638',
    fontWeight: '700',
  },
});