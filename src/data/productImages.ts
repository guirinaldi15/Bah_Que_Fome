import type { ImageSourcePropType } from 'react-native';

const images: Partial<Record<string, ImageSourcePropType>> = {
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
  '14': { uri: 'https://imageproxy.wolt.com/menu/menu-images/67f63648aae8ecfe2902994a/aead168a-1f0f-11f1-8cfb-9ec9a752073a_ibignpt_piqghlh_xewsehy.jpeg' },
  '15': { uri: 'https://ojoalplato-static.s3.amazonaws.com/media/gallery/chianti/dsc_0035.jpg' },
  '16': { uri: 'https://www.sandravalvassori.com/wp-content/uploads/2024/02/Risotto-Mushroom-2-352-1152x1536.jpg' },
  '17': { uri: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Insalatacaprese.jpg' },
  '18': { uri: 'https://ogimg.infoglobo.com.br/in/22902788-691-966/FT1086A/MEALSBolinho-de-CostelaFoto-Bernardo-Fasano.jpg' },
  '19': { uri: 'https://www.alphafoodie.com/wp-content/uploads/2021/09/mint-lemonade-square.jpeg' },
};

export function getProductImage(
  id: string
): ImageSourcePropType | undefined {
  return images[id];
}