/** Fallback location data — live site uses /api/site (admin editable). */

export const RESTAURANT = {
  id: "restaurant",
  street: "Viale Toscana 2",
  area: "20136 Milano",
  phone: "+39 02 9166 3939",
  tel: "tel:+390291663939",
  phones: [
    { display: "+39 02 9166 3939", tel: "tel:+390291663939" },
    { display: "+39 339 178 5899", tel: "tel:+393391785899" },
  ],
  maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Viale+Toscana+2+20136+Milano",
};

export const TAKEAWAY = {
  id: "takeaway",
  street: "Corso di Porta Romana 25",
  area: "20122 Milano",
  phone: "+39 02 5830 7508",
  tel: "tel:+390258307508",
  phones: [{ display: "+39 02 5830 7508", tel: "tel:+390258307508" }],
  maps: "https://www.google.com/maps/search/?api=1&query=Shalimar+Corso+di+Porta+Romana+25+20122+Milano",
};
