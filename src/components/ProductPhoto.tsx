import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ImageProps } from 'react-native';

import { getProductImage } from '../data/productImages';
import type { Product } from '../data/products';
import { COLORS } from '../styles/theme';

type Props = Pick<ImageProps, 'style' | 'resizeMode'> & {
  product: Product;
};

export default function ProductPhoto({ product, style, resizeMode }: Props) {
  const source = getProductImage(product.id);

  if (source) {
    return <Image source={source} style={style} resizeMode={resizeMode} />;
  }

  return (
    <View style={[style, styles.placeholder]} accessible={false}>
      <Text style={styles.emoji}>{product.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.muted,
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 24,
  },
});