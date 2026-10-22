export type ProductExtra = {
  ingredients: string[];
  origin: string;
  curiosity: string;
  serves: string;
};

export const PRODUCT_DETAILS: Record<string, ProductExtra> = {
  '1': {
    ingredients: [
      'Massa de pizza',
      'Molho de tomate',
      'Muçarela',
      'Manjericão',
      'Azeite'
    ],
    origin: 'Nápoles, Itália',
    curiosity:
      'A Pizza Margherita é tradicionalmente associada às cores da bandeira italiana.',
    serves: '1 a 2 pessoas'
  },

  '2': {
    ingredients: [
      'Massa de pizza',
      'Cogumelos',
      'Muçarela',
      'Orégano'
    ],
    origin: 'Itália',
    curiosity:
      'Os cogumelos são ingredientes tradicionais de diversas receitas italianas.',
    serves: '1 a 2 pessoas'
  },

  '3': {
    ingredients: [
      'Massa de pizza',
      'Calabresa',
      'Cebola',
      'Muçarela',
      'Molho de tomate'
    ],
    origin: 'Culinária ítalo-brasileira',
    curiosity:
      'A pizza de calabresa é uma das variedades mais populares no Brasil.',
    serves: '1 a 2 pessoas'
  },

  '4': {
    ingredients: [
      'Spaghetti',
      'Ovos',
      'Queijo pecorino',
      'Carne suína curada',
      'Pimenta-do-reino'
    ],
    origin: 'Roma, Itália',
    curiosity:
      'Na receita romana tradicional, a cremosidade vem dos ovos e do queijo.',
    serves: '1 pessoa'
  },

  '5': {
    ingredients: [
      'Fettuccine',
      'Manteiga',
      'Parmesão'
    ],
    origin: 'Roma, Itália',
    curiosity:
      'O Fettuccine Alfredo ficou conhecido pela combinação simples de massa, manteiga e queijo.',
    serves: '1 pessoa'
  },

  '6': {
    ingredients: [
      'Pão',
      'Tomate',
      'Manjericão',
      'Alho',
      'Azeite'
    ],
    origin: 'Itália',
    curiosity:
      'A bruschetta é tradicionalmente preparada com pão tostado e azeite.',
    serves: '1 a 2 pessoas'
  },

  '7': {
    ingredients: [
      'Mascarpone',
      'Café',
      'Biscoito',
      'Cacau',
      'Ovos'
    ],
    origin: 'Itália',
    curiosity:
      'O nome Tiramisù é frequentemente interpretado como uma expressão relacionada a levantar o ânimo.',
    serves: '1 pessoa'
  },

  '8': {
    ingredients: [
      'Água',
      'Malte',
      'Lúpulo',
      'Levedura'
    ],
    origin: 'Estilo Pilsen',
    curiosity:
      'O estilo Pilsen é conhecido pela leveza, coloração clara e perfil refrescante.',
    serves: '300 ml'
  },

  '9': {
    ingredients: [
      'Água',
      'Malte',
      'Lúpulo',
      'Levedura'
    ],
    origin: 'Estilo India Pale Ale',
    curiosity:
      'As cervejas IPA normalmente apresentam amargor e aromas de lúpulo mais destacados.',
    serves: '300 ml'
  },

  '10': {
    ingredients: [
      'Água',
      'Malte de trigo',
      'Malte de cevada',
      'Lúpulo',
      'Levedura'
    ],
    origin: 'Estilo de trigo',
    curiosity:
      'As cervejas de trigo possuem características próprias de aroma e textura.',
    serves: '500 ml'
  },

  '11': {
    ingredients: [
      'Limão',
      'Cachaça',
      'Açúcar',
      'Gelo'
    ],
    origin: 'Brasil',
    curiosity:
      'A caipirinha é um dos coquetéis mais conhecidos da cultura brasileira.',
    serves: '1 pessoa'
  },

  '12': {
    ingredients: [
      'Batata',
      'Azeite',
      'Sal',
      'Temperos'
    ],
    origin: 'Culinária contemporânea',
    curiosity:
      'A batata rústica costuma ser servida com casca e temperos variados.',
    serves: '1 a 2 pessoas'
  },

  '13': {
    ingredients: [
      'Fubá',
      'Água',
      'Sal',
      'Óleo'
    ],
    origin: 'Influência italiana na culinária brasileira',
    curiosity:
      'A polenta tem raízes na gastronomia italiana e se popularizou no Brasil.',
    serves: '1 a 2 pessoas'
  }
};