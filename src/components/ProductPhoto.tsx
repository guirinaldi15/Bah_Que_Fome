import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ImageProps } from 'react-native';

import type { Product } from '../data/products';
import { getProductImage } from '../data/productImages';
import { COLORS } from '../styles/theme';

type Props = Pick<ImageProps, 'style' | 'resizeMode'> & {
  product: Product;
};

export default function ProductPhoto({ product, style, resizeMode }: Props) {
  return <ProductPhotoContent key={product.id} product={product} style={style} resizeMode={resizeMode} />;
}

function ProductPhotoContent({ product, style, resizeMode }: Props) {
  const [failed, setFailed] = useState(false);
  const source = getProductImage(product.id);

  if (source && !failed) {
    return <Image source={source} style={style} resizeMode={resizeMode} onError={() => setFailed(true)} />;
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
  emoji: { fontSize: 24 },
});
