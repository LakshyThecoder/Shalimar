/** Shalimar Takeaway — Corso di Porta Romana 25. Separate from the Viale Toscana restaurant menu. */

export const TAKEAWAY_SECTIONS = [
  {
    id: "offerta",
    featured: true,
    isSetMenu: true,
    items: [
      {
        id: "meno-carne-box",
        name: "Meno Carne - Box",
        price: 13,
        includes: [
          "Riso pulao o riso bianco",
          "Lenticchie",
          "Chicken tikka masala",
          "Pepsi lattina o acqua da 50 cl",
        ],
        desc: {
          it: "Riso pulao o riso bianco, lenticchie, chicken tikka masala, e pepsi lattina o acqua da 50 cl",
          en: "Pulao or white rice, lentils, chicken tikka masala, and a can of Pepsi or 50 cl water",
        },
      },
    ],
  },
  {
    id: "fritti",
    items: [
      {
        id: "pakora-ta",
        name: "Pakora",
        price: 3,
        desc: {
          it: "Verdure miste passate in pastella di farina di ceci e fritti",
          en: "Mixed vegetables in chickpea batter, fried",
        },
      },
      {
        id: "samosa-chat-ta",
        name: "Samosa Chat",
        price: 6,
        desc: {
          it: "Samosa, ceci, salsa yogurt, menta e salsa piccante",
          en: "Samosa, chickpeas, yogurt sauce, mint and spicy sauce",
        },
      },
      {
        id: "samosa-carne-ta",
        name: "Samosa Carne - 1 Pezzo",
        price: 1.5,
        desc: {
          it: "Fagottini ripieni di carne, cumino, sale, peperoncino e farina 00",
          en: "Pastry filled with meat, cumin, salt, chilli and flour",
        },
      },
      {
        id: "kashmiri-tikki-ta",
        name: "Kashmiri Tikki",
        price: 1.5,
        desc: {
          it: "Patate, formaggio, curcuma, peperoncino, coriandolo, olio, comino e timo",
          en: "Potato and cheese with turmeric, chilli, coriander, cumin and thyme",
        },
      },
      {
        id: "papad-ta",
        name: "Papad",
        price: 1,
        desc: {
          it: "Croccanti frittatine a base di legumi",
          en: "Crispy lentil wafers",
        },
      },
      {
        id: "samosa-ta",
        name: "Samosa",
        price: 1.5,
        desc: {
          it: "Fagottini ripieni di verdure",
          en: "Pastries filled with vegetables",
        },
      },
    ],
  },
  {
    id: "vegetarian",
    items: [
      {
        id: "daal-ta",
        name: "Daal",
        price: 7,
        desc: { it: "Legumi, in salsa di spezie", en: "Legumes in a spiced sauce" },
      },
      {
        id: "spinaci-patate",
        name: "Spinaci E Patate",
        price: 9,
        desc: {
          it: "Spinaci, patate, acqua, olio, pomodori, coriandolo e curcuma",
          en: "Spinach and potatoes with tomato, coriander and turmeric",
        },
      },
      {
        id: "daal-makhani-ta",
        name: "Daal Makhani",
        price: 8,
        desc: {
          it: "Lenticchie nere, pomodori, cipolla, curcuma, olio e coriandolo",
          en: "Black lentils with tomato, onion, turmeric and coriander",
        },
      },
      {
        id: "punjabi-bartha",
        name: "Punjabi Bartha",
        price: 8,
        desc: {
          it: "Melanzane, cipolla, pomodori, olio, curcuma e sale",
          en: "Aubergine with onion, tomato and turmeric",
        },
      },
      {
        id: "fagiolini-curry",
        name: "Fagiolini Al Curry",
        price: 7,
        desc: {
          it: "Fagiolini, pomodori, olio, cipolla e spezia",
          en: "Green beans with tomato, onion and spices",
        },
      },
    ],
  },
  {
    id: "secondi",
    items: [
      {
        id: "pollo-tandoori-ta",
        name: "Pollo Tandoori",
        price: 10,
        desc: { it: "Pollo marinato in yogurt speziato", en: "Chicken marinated in spiced yogurt" },
      },
      {
        id: "agnello-curry-ta",
        name: "Agnello Al Curry",
        price: 12,
        desc: { it: "Agnello in salsa curry", en: "Lamb in curry sauce" },
      },
      {
        id: "pollo-curry-ta",
        name: "Pollo Al Curry",
        price: 11,
        desc: { it: "Pollo in salsa curry", en: "Chicken in curry sauce" },
      },
      {
        id: "chicken-karahi-ta",
        name: "Chicken Karahi",
        price: 11,
        desc: { it: "Pollo in salsa curry e spezie", en: "Chicken in curry sauce and spices" },
      },
      {
        id: "madras-curry-ta",
        name: "Madras Curry",
        price: 11,
        spicy: true,
        desc: { it: "Pollo in salsa curry e spezie", en: "Chicken in curry sauce and spices" },
      },
      {
        id: "pollo-tikka-ta",
        name: "Pollo Tikka",
        price: 11,
        desc: {
          it: "Bocconcini di pollo disossato marinato in yogurt speziato",
          en: "Boneless chicken pieces marinated in spiced yogurt",
        },
      },
      {
        id: "shami-kebab-ta",
        name: "Shami Kebab",
        price: 1.5,
        desc: {
          it: "Pollo, lenticchie macinate, pepe nero, uova e spezie",
          en: "Chicken, ground lentils, black pepper, egg and spices",
        },
      },
      {
        id: "pollo-kurma-ta",
        name: "Pollo Kurma",
        price: 11,
        desc: {
          it: "Pollo con mandorle, yogurt e salsa kurma",
          en: "Chicken with almonds, yogurt and korma sauce",
        },
      },
    ],
  },
  {
    id: "basmati",
    items: [
      {
        id: "pollo-biryani-ta",
        name: "Pollo Biryani",
        price: 8,
        desc: {
          it: "Riso con pollo speziato con mandorle e anacardi",
          en: "Spiced rice with chicken, almonds and cashews",
        },
      },
      {
        id: "riso-bianco-ta",
        name: "Riso Bianco",
        price: 6,
        desc: { it: "Riso basmati e piselli", en: "Basmati rice and peas" },
      },
      {
        id: "riso-pulao-ta",
        name: "Riso Pulao",
        price: 6,
        desc: { it: "Riso cucinato con zafferano indiano", en: "Rice cooked with Indian saffron" },
      },
      {
        id: "biryani-veg-ta",
        name: "Biryani Vegetariano",
        price: 7,
        desc: { it: "Riso basmati e verdure speziati", en: "Spiced basmati rice and vegetables" },
      },
    ],
  },
  {
    id: "salse",
    items: [
      {
        id: "salsa-piccante",
        name: "Salsa Piccante",
        price: 1,
        desc: { it: "Salsa piccante", en: "Spicy sauce" },
      },
      {
        id: "salsa-yogurt-menta",
        name: "Salsa Yoghurt E Menta",
        price: 1,
        desc: { it: "Salsa menta", en: "Mint yogurt sauce" },
      },
    ],
  },
  {
    id: "naan",
    items: [
      {
        id: "stuffed-paratha",
        name: "Stuffed Paratha",
        price: 2.5,
        desc: {
          it: "Focaccine di farina integrale ripiene di verdure",
          en: "Wholemeal flatbread stuffed with vegetables",
        },
      },
      {
        id: "cheese-naan-ta",
        name: "Cheese Naan",
        price: 2,
        desc: { it: "Focaccine ripiene di formaggio", en: "Flatbread stuffed with cheese" },
      },
      {
        id: "naan-ta",
        name: "Naan",
        price: 1.5,
        desc: { it: "Focaccine di farina bianca cotte nel forno", en: "White-flour flatbread baked in the oven" },
      },
      {
        id: "chicken-roll-ta",
        name: "Chicken Roll",
        price: 5,
        desc: { it: "Panino indiano con pollo", en: "Indian roll with chicken" },
      },
    ],
  },
  {
    id: "combo",
    items: [
      {
        id: "pollo-tikka-masala-combo",
        name: "Pollo Tikka Masala",
        price: 13.5,
        desc: { it: "Pezzi di pollo e spezie", en: "Chicken pieces and spices" },
      },
    ],
  },
  {
    id: "dolci",
    items: [
      {
        id: "berfi-pistacchio",
        name: "Berfi Pistacchio",
        price: 1.5,
        desc: {
          it: "Zucchero, latte in polvere, burro, acqua, cardamomo e pistacchio",
          en: "Sugar, milk powder, butter, water, cardamom and pistachio",
        },
      },
      {
        id: "laddu",
        name: "Laddu",
        price: 1.5,
        desc: {
          it: "Farina di ceci, zucchero, acqua, cardamomo, olio e pistacchio",
          en: "Chickpea flour, sugar, water, cardamom, oil and pistachio",
        },
      },
      {
        id: "dolce-cocco",
        name: "Dolce Di Cocco",
        price: 1.5,
        desc: { it: "Acqua, latte, zucchero e cocco", en: "Water, milk, sugar and coconut" },
      },
      {
        id: "ciam-ciam",
        name: "Ciam Ciam",
        price: 1.5,
        desc: {
          it: "Zucchero, latte, acqua, burro e cardamomo",
          en: "Sugar, milk, water, butter and cardamom",
        },
      },
      {
        id: "berfi-mandorle",
        name: "Berfi Mandorle",
        price: 1.5,
        desc: {
          it: "Zucchero, latte in polvere, burro, acqua, cardamomo e mandorle",
          en: "Sugar, milk powder, butter, water, cardamom and almonds",
        },
      },
      {
        id: "gullab-giamin",
        name: "Gullab Giamin",
        price: 1.5,
        desc: {
          it: "Zucchero, latte in polvere, acqua, cardamomo, olio e bicarbonato di sodio",
          en: "Sugar, milk powder, water, cardamom, oil and bicarbonate of soda",
        },
      },
    ],
  },
  {
    id: "bevande",
    items: [
      { id: "acqua-frizzante", name: "Acqua Frizzante 50cl", price: 1 },
      { id: "acqua-naturale", name: "Acqua Naturale 50cl", price: 1 },
      { id: "bibita-lattina", name: "Bibita In Lattina 33cl", price: 2.5 },
      { id: "bibita-33", name: "Bibita 33cl", price: 2.5 },
      { id: "bibita-50", name: "Bibita 50cl", price: 3 },
      { id: "succo-mango-ta", name: "Succo Di Mango", price: 2.5, desc: { it: "Succo di mango", en: "Mango juice" } },
      {
        id: "redbull-ta",
        name: "Red Bull Energy Drink, 355ml",
        price: 2.5,
      },
    ],
  },
  {
    id: "birre",
    items: [
      {
        id: "birra-33",
        name: "Birra 33cl",
        price: 3,
        desc: { it: "Zero alcol. Moretti o Heineken", en: "Zero alcohol. Moretti or Heineken" },
      },
    ],
  },
];
