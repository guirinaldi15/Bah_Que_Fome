import type { ImageSourcePropType } from 'react-native';

const images: Record<string, ImageSourcePropType> = {
  '1': require('../../assets/images/pizza-margherita.jpg'),
  '2': require('../../assets/images/pizza-funghi.jpg'),
  '3': require('../../assets/images/pizza-calabresa.jpg'),
  '4': require('../../assets/images/carbonara.jpg'),
  '5': require('../../assets/images/fettuccine.jpg'),
  '6': require('../../assets/images/bruschetta.jpg'),
  '7': require('../../assets/images/tiramisu.jpg'),
  '8': require('../../assets/images/chopp-pilsen.jpg'),
  '9': require('../../assets/images/chopp-ipa.jpg'),
  '10': require('../../assets/images/chopp-weiss.jpg'),
  '11': require('../../assets/images/caipirinha.jpg'),
  '12': require('../../assets/images/batata.jpg'),
  '13': require('../../assets/images/polenta.jpg'),
};

export function getProductImage(
  id: string
): ImageSourcePropType {
  return images[id] ?? images['1'];
}