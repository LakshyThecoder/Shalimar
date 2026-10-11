/** Default bilingual website content — editable from /admin */

const t = (en, it) => ({ en, it });

export const SITE_DEFAULT = {
  version: 2,
  updatedAt: null,
  brand: {
    name: "SHALIMAR",
    hindi: "शालिमार",
    tagline: t(
      "Indian and Pakistani food in Milan",
      "Cucina indiana e pakistana a Milano"
    ),
    footerLine: t(
      "Halal Indian and Pakistani food in Milan.",
      "Cucina indiana e pakistana Halal a Milano."
    ),
  },
  nav: {
    links: [
      { id: "restaurant", label: t("Restaurant", "Ristorante"), href: "#restaurant" },
      { id: "takeaway", label: t("Takeaway", "Take away"), href: "#takeaway" },
      { id: "menus", label: t("Menus", "Menu"), href: "#menus" },
      { id: "locations", label: t("Locations", "Dove siamo"), href: "#visit" },
      { id: "contact", label: t("Contact", "Contatti"), href: "#visit" },
    ],
    book: t("Book a table", "Prenota un tavolo"),
    orderTakeaway: t("Order takeaway", "Ordina asporto"),
  },
  hero: {
    title: "SHALIMAR",
    headline: t("Two locations.", "Due sedi."),
    subhead: t("Two different Shalimar menus.", "Due menu Shalimar diversi."),
    paragraphs: [
      t(
        "Sit down for lunch or dinner at our restaurant on Viale Toscana.",
        "Pranzi e cene al ristorante in Viale Toscana."
      ),
      t(
        "For a quick meal, takeaway or Indian sweets, visit us on Corso di Porta Romana.",
        "Per un pasto veloce, asporto o dolci indiani, vieni in Corso di Porta Romana."
      ),
    ],
    cards: [
      {
        id: "restaurant",
        label: t("Viale Toscana restaurant", "Ristorante Viale Toscana"),
        href: "#restaurant",
      },
      {
        id: "takeaway",
        label: t("Porta Romana takeaway", "Take away Porta Romana"),
        href: "#takeaway",
      },
    ],
    tags: t(
      "Halal · Vegetarian options · Takeaway · Delivery",
      "Halal · Opzioni vegetariane · Asporto · Delivery"
    ),
  },
  restaurant: {
    eyebrow: t("SHALIMAR RESTAURANT", "SHALIMAR RISTORANTE"),
    title: t("Viale Toscana", "Viale Toscana"),
    lead: t(
      "A small restaurant with a large menu.",
      "Un ristorante piccolo, con un menu grande."
    ),
    paragraphs: [
      t(
        "Start with samosas or pakora, order something from the tandoor and choose from more than 30 curries and main dishes. There are also biryanis, kebabs, seafood, vegetarian dishes and 12 kinds of bread.",
        "Inizia con samosa o pakora, scegli qualcosa dal tandoor e tra più di 30 curry e secondi. Ci sono anche biryani, kebab, pesce, piatti vegetariani e 12 tipi di pane."
      ),
      t(
        "The food can be mild or spicy. If you are unsure what to order, tell us what you like and we will help you choose.",
        "I piatti possono essere delicati o piccanti. Se non sai cosa ordinare, dicci cosa ti piace e ti aiutiamo a scegliere."
      ),
    ],
    addressLine: "Viale Toscana 2, Milano",
    ctaBook: t("Book a table", "Prenota un tavolo"),
    ctaMenu: t("View the restaurant menu", "Vedi il menu del ristorante"),
  },
  takeaway: {
    eyebrow: t("INDIAN TAKE AWAY & SWEET HOUSE", "INDIAN TAKE AWAY & SWEET HOUSE"),
    title: t("Corso di Porta Romana", "Corso di Porta Romana"),
    lead: t(
      "Shalimar Porta Romana is made for quick lunches, easy dinners and food to take home.",
      "Shalimar Porta Romana è pensato per pranzi veloci, cene semplici e cibo da asporto."
    ),
    paragraphs: [
      t(
        "Choose a vegetarian or meat meal box, or order separately from the counter. The menu includes samosas, pakora, biryani, chicken tikka, curries, daal, vegetables, naan and roti.",
        "Scegli un box vegetariano o di carne, oppure ordina al banco. Il menu include samosa, pakora, biryani, chicken tikka, curry, daal, verdure, naan e roti."
      ),
      t(
        "There are only a few seats, so most customers take their food away.",
        "Ci sono pochi posti a sedere: la maggior parte dei clienti porta via."
      ),
      t(
        "Before you leave, look at the sweet counter. Depending on the day, you may find gulab jamun, laddu, rasgulla and barfi made with coconut, pistachio, almond or carrot.",
        "Prima di uscire, guarda il bancone dei dolci. A seconda del giorno trovi gulab jamun, laddu, rasgulla e barfi al cocco, pistacchio, mandorla o carota."
      ),
    ],
    addressLine: "Corso di Porta Romana 25, Milano",
    ctaOrder: t("Order takeaway", "Ordina asporto"),
    ctaMenu: t("View the takeaway menu", "Vedi il menu take away"),
  },
  menuGuide: {
    eyebrow: t("THE MENU", "IL MENU"),
    title: t("What would you like?", "Cosa ti va di mangiare?"),
    chapters: [
      {
        title: t("From the tandoor", "Dal tandoor"),
        body: t(
          "Chicken tandoori, chicken tikka, malai tikka, seekh kebab, lamb tikka and fish tandoori. The meat or fish is marinated with spices and cooked at high heat in the tandoor.",
          "Chicken tandoori, chicken tikka, malai tikka, seekh kebab, lamb tikka e fish tandoori. Carne o pesce marinati con spezie e cotti ad alta temperatura nel tandoor."
        ),
      },
      {
        title: t("Curries", "Curry"),
        body: t(
          "Chicken, lamb, fish and prawn dishes prepared in different styles, from mild korma to hotter madras and vindaloo. If you do not eat spicy food, ask us for a recommendation.",
          "Piatti di pollo, agnello, pesce e gamberi in stili diversi, dal delicato korma al più piccante madras e vindaloo. Se non mangi piccante, chiedici un consiglio."
        ),
      },
      {
        title: t("Biryani and rice", "Biryani e riso"),
        body: t(
          "Basmati rice served plain, as pulao or cooked as biryani with vegetables, chicken, lamb or prawns.",
          "Riso basmati in bianco, come pulao o come biryani con verdure, pollo, agnello o gamberi."
        ),
      },
      {
        title: t("Vegetarian dishes", "Piatti vegetariani"),
        body: t(
          "Daal tarka, daal makhani, chana masala, palak paneer, aloo gobi, aubergine, spinach, potatoes and mixed vegetables. These are complete dishes, not side orders.",
          "Daal tarka, daal makhani, chana masala, palak paneer, aloo gobi, melanzane, spinaci, patate e verdure miste. Sono piatti completi, non contorni."
        ),
      },
      {
        title: t("Bread", "Pane"),
        body: t(
          "Naan, butter naan, garlic naan, cheese naan, keema naan, roti, chapati and stuffed breads.",
          "Naan, butter naan, garlic naan, cheese naan, keema naan, roti, chapati e pani farciti."
        ),
      },
      {
        title: t("Sweets", "Dolci"),
        body: t(
          "Kulfi, kheer, gulab jamun and coconut barfi at Viale Toscana. At Porta Romana, the sweet counter also includes laddu, rasgulla and different kinds of barfi.",
          "Kulfi, kheer, gulab jamun e coconut barfi in Viale Toscana. A Porta Romana il bancone dolci include anche laddu, rasgulla e diversi tipi di barfi."
        ),
      },
    ],
    ctaRestaurant: t("Restaurant menu", "Menu ristorante"),
    ctaTakeaway: t("Takeaway menu", "Menu take away"),
  },
  guide: {
    eyebrow: t("NEW TO THE MENU?", "PRIMA VOLTA?"),
    title: t("A simple place to start", "Un modo semplice per iniziare"),
    paragraphs: [
      t(
        "Order a few dishes and share them.",
        "Ordina alcuni piatti e condividili."
      ),
      t(
        "Try samosas to begin, followed by chicken tandoori or chicken tikka. Add one curry, one vegetarian dish, basmati rice and naan for the table.",
        "Prova le samosa per iniziare, poi chicken tandoori o chicken tikka. Aggiungi un curry, un piatto vegetariano, riso basmati e naan per il tavolo."
      ),
      t(
        "For something mild, try chicken korma or butter chicken.",
        "Per qualcosa di delicato, prova chicken korma o butter chicken."
      ),
      t(
        "For more heat, ask about madras, vindaloo or karahi.",
        "Per più piccante, chiedi di madras, vindaloo o karahi."
      ),
      t(
        "For a vegetarian meal, start with daal, chana masala or palak paneer and add rice or bread.",
        "Per un pasto vegetariano, inizia con daal, chana masala o palak paneer e aggiungi riso o pane."
      ),
      t(
        "You do not need to know the names of every dish. Tell us what you normally enjoy and how spicy you want your food.",
        "Non serve conoscere il nome di ogni piatto. Dicci cosa ti piace di solito e quanto lo vuoi piccante."
      ),
    ],
  },
  reviews: {
    eyebrow: t("REVIEWS", "RECENSIONI"),
    title: t("What customers mention most", "Cosa dicono più spesso"),
    restaurantNote: t(
      "Guests regularly mention the friendly service, wide choice and reasonable prices at Viale Toscana.",
      "Gli ospiti citano spesso il servizio cordiale, la scelta ampia e i prezzi onesti di Viale Toscana."
    ),
    restaurantScore: t(
      "The restaurant is currently rated 8.9 out of 10 on TheFork, based on approximately 380 reviews.",
      "Il ristorante è valutato 8,9 su 10 su TheFork, su circa 380 recensioni."
    ),
    takeawayScore: t(
      "The Porta Romana takeaway is currently rated 4.1 out of 5 on Tripadvisor, based on approximately 120 reviews.",
      "Il take away di Porta Romana è valutato 4,1 su 5 su Tripadvisor, su circa 120 recensioni."
    ),
    takeawayNote: t(
      "Customers often recommend the samosas, cheese naan and affordable meal boxes.",
      "I clienti consigliano spesso le samosa, il cheese naan e i box a buon prezzo."
    ),
    footnote: t(
      "Ratings checked in October 2026 and may change.",
      "Valutazioni verificate a ottobre 2026 e soggette a variazioni."
    ),
    quotes: [
      {
        text: t(
          "Small, well-appointed room, clean, great food, reasonable prices and friendly staff. The menu has many specialities worth coming back to try.",
          "Sala piccola e curata, pulita, ottimo cibo, prezzi onesti e personale cordiale. Il menu ha molte specialità per cui vale tornare."
        ),
        author: "Nicola N.",
        source: "Tripadvisor · July 2025",
      },
      {
        text: t(
          "Excellent cuisine, not particularly spicy, with attentive service and very interesting prices. I will return with the family.",
          "Ottima cucina, non particolarmente piccante, con servizio attento e prezzi molto interessanti. Tornerò con la famiglia."
        ),
        author: "Mariaregina7",
        source: "Tripadvisor · November 2023",
      },
    ],
  },
  locations: {
    restaurant: {
      eyebrow: t("RESTAURANT", "RISTORANTE"),
      title: "Viale Toscana 2",
      area: "20136 Milano",
      phones: [
        { display: "+39 02 9166 3939", tel: "tel:+390291663939" },
        { display: "+39 339 178 5899", tel: "tel:+393391785899" },
      ],
      hoursLabel: t("Hours", "Orari"),
      hours: [
        {
          label: t("Monday", "Lunedì"),
          value: t("Closed", "Chiuso"),
          closed: true,
        },
        {
          label: t("Tuesday", "Martedì"),
          value: "11:30–14:30 · 18:00–22:30",
        },
        {
          label: t("Wednesday", "Mercoledì"),
          value: "11:30–14:30 · 18:00–22:30",
        },
        {
          label: t("Thursday", "Giovedì"),
          value: "11:30–14:30 · 18:00–22:30",
        },
        {
          label: t("Friday", "Venerdì"),
          value: "11:30–14:30 · 18:00–22:30",
        },
        {
          label: t("Saturday", "Sabato"),
          value: "11:30–14:30 · 18:00–22:30",
        },
        {
          label: t("Sunday", "Domenica"),
          value: "11:30–14:30 · 18:00–22:30",
        },
      ],
      note: t(
        "Reservations are available by phone.",
        "Le prenotazioni si fanno per telefono."
      ),
      ctaCall: t("Call to book", "Chiama per prenotare"),
      ctaMaps: t("Open in Maps", "Apri in Maps"),
      maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Viale+Toscana+2+20136+Milano",
    },
    takeaway: {
      eyebrow: t("TAKEAWAY & SWEET HOUSE", "TAKE AWAY & SWEET HOUSE"),
      title: "Corso di Porta Romana 25",
      area: "20122 Milano",
      phones: [{ display: "+39 02 5830 7508", tel: "tel:+390258307508" }],
      hoursLabel: t("Pickup hours", "Orari ritiro"),
      hours: [
        {
          label: t("Monday", "Lunedì"),
          value: "11:00–21:30",
        },
        {
          label: t("Tuesday", "Martedì"),
          value: "11:00–21:30",
        },
        {
          label: t("Wednesday", "Mercoledì"),
          value: "11:00–21:30",
        },
        {
          label: t("Thursday", "Giovedì"),
          value: "11:00–21:30",
        },
        {
          label: t("Friday", "Venerdì"),
          value: "11:00–21:30",
        },
        {
          label: t("Saturday", "Sabato"),
          value: "11:00–21:30",
        },
        {
          label: t("Sunday", "Domenica"),
          value: "11:00–21:30",
        },
      ],
      note: t(
        "Delivery hours may finish earlier. Check the ordering page or call before placing a late order.",
        "La delivery può chiudere prima. Controlla la pagina ordini o chiama prima di un ordine tardi."
      ),
      note2: t("No reservation is required.", "Non serve prenotare."),
      ctaCall: t("Call the takeaway", "Chiama il take away"),
      ctaOrder: t("Order online", "Ordina online"),
      ctaMaps: t("Open in Maps", "Apri in Maps"),
      maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Corso+di+Porta+Romana+25+20122+Milano",
      orderUrl: "",
    },
  },
  footer: {
    copyright: t(
      "© {{year}} Shalimar Milano",
      "© {{year}} Shalimar Milano"
    ),
  },
  links: {
    restaurantMenu: "/menu",
    takeawayMenu: "/menu",
    orderOnline: "",
  },
};
