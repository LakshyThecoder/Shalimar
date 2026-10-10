import { useSite } from "../../context/SiteContent";

/** Visible FAQ — supports FAQ rich results + target keywords naturally */
export default function SeoFaq() {
  const { lang } = useSite();
  const it = lang === "it";

  const faqs = it
    ? [
        {
          q: "Shalimar è Halal?",
          a: "Sì. Shalimar serve cucina indiana e pakistana Halal in entrambe le sedi di Milano.",
        },
        {
          q: "Dove si trova il ristorante Shalimar a Milano?",
          a: "Il ristorante è in Viale Toscana 2, 20136 Milano. Il take away e sweet house è in Corso di Porta Romana 25, 20122 Milano.",
        },
        {
          q: "Qual è il miglior cibo indiano da provare da Shalimar?",
          a: "Molti clienti scelgono chicken tandoori, chicken tikka, curry, biryani, naan e samosa. Chiedi allo staff se preferisci delicato o piccante.",
        },
        {
          q: "Si può ordinare asporto da Shalimar?",
          a: "Sì. A Porta Romana puoi prendere cibo e dolci da asporto tutti i giorni. Al ristorante in Viale Toscana puoi anche prenotare un tavolo.",
        },
      ]
    : [
        {
          q: "Is Shalimar Halal?",
          a: "Yes. Shalimar serves Halal Indian and Pakistani food at both Milan locations.",
        },
        {
          q: "Where is Shalimar restaurant in Milan?",
          a: "The restaurant is at Viale Toscana 2, 20136 Milano. Takeaway and sweets are at Corso di Porta Romana 25, 20122 Milano.",
        },
        {
          q: "What is the best Indian food at Shalimar?",
          a: "Guests often order chicken tandoori, chicken tikka, curries, biryani, naan and samosas. Ask us for mild or spicy recommendations.",
        },
        {
          q: "Can I order takeaway from Shalimar?",
          a: "Yes. At Porta Romana you can take food and sweets away every day. At Viale Toscana you can also book a table.",
        },
      ];

  return (
    <section
      id="faq"
      className="py-20 md:py-28 px-6 md:px-12 lg:px-16 border-t border-sh-border bg-sh-surface scroll-mt-24"
      aria-labelledby="seo-faq-heading"
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-sh-saffron font-semibold mb-4">
        {it ? "Domande frequenti" : "FAQ"}
      </p>
      <h2
        id="seo-faq-heading"
        className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-[0.9] max-w-3xl"
      >
        {it
          ? "Shalimar Milano — ristorante indiano Halal"
          : "Shalimar Milan — Halal Indian restaurant"}
      </h2>
      <p className="mt-5 max-w-2xl text-sh-muted leading-relaxed">
        {it
          ? "Risposte rapide su Halal, sedi, menu e take away. Shalimar è tra i punti di riferimento per la cucina indiana a Milano."
          : "Quick answers about Halal dining, locations, menu and takeaway. Shalimar is a go-to for Indian food in Milan."}
      </p>
      <dl className="mt-12 max-w-3xl space-y-0 border-t border-sh-border">
        {faqs.map((item) => (
          <div key={item.q} className="border-b border-sh-border py-5">
            <dt className="font-display text-xl md:text-2xl uppercase tracking-tight text-sh-saffron">
              {item.q}
            </dt>
            <dd className="mt-2 text-sh-text/85 leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
