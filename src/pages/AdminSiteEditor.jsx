import { useEffect, useMemo, useState } from "react";
import { adminGetSite, adminResetSite, adminSaveSite, SITE_DEFAULT } from "../lib/siteApi";

const TABS = [
  { id: "hero", label: "Home hero", hint: "First screen on the homepage" },
  { id: "nav", label: "Navigation", hint: "Top menu links and buttons" },
  { id: "restaurant", label: "Restaurant", hint: "Viale Toscana block" },
  { id: "takeaway", label: "Takeaway", hint: "Porta Romana block" },
  { id: "menuGuide", label: "The menu", hint: "Category intro cards" },
  { id: "guide", label: "How to order", hint: "New to the menu tips" },
  { id: "reviews", label: "Reviews", hint: "Scores, notes and quotes" },
  { id: "phones", label: "Visit & hours", hint: "Phones, maps, hours, CTAs" },
  { id: "json", label: "Raw JSON", hint: "Full file — advanced" },
];

export default function AdminSiteEditor({ onToast }) {
  const [site, setSite] = useState(null);
  const [baseline, setBaseline] = useState("");
  const [json, setJson] = useState("");
  const [section, setSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadedAt, setLoadedAt] = useState(null);

  const load = () =>
    adminGetSite()
      .then((data) => {
        setSite(data);
        const pretty = JSON.stringify(data, null, 2);
        setJson(pretty);
        setBaseline(pretty);
        setLoadedAt(data.updatedAt || new Date().toISOString());
        setError("");
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const dirty = useMemo(() => {
    if (!site) return false;
    const current = section === "json" ? json : JSON.stringify(site, null, 2);
    return current !== baseline;
  }, [site, json, section, baseline]);

  const setPath = (path, value) => {
    setSite((prev) => {
      const next = structuredClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] == null) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      setJson(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = section === "json" ? JSON.parse(json) : site;
      const r = await adminSaveSite(payload);
      setSite(r.site);
      const pretty = JSON.stringify(r.site, null, 2);
      setJson(pretty);
      setBaseline(pretty);
      setLoadedAt(r.site.updatedAt);
      onToast?.("Website saved — open Preview to see it live");
    } catch (err) {
      setError(err.message);
      onToast?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!confirm("Reset all homepage text to the original defaults? This cannot be undone.")) return;
    setSaving(true);
    setError("");
    try {
      const r = await adminResetSite();
      setSite(r.site);
      const pretty = JSON.stringify(r.site, null, 2);
      setJson(pretty);
      setBaseline(pretty);
      setLoadedAt(r.site.updatedAt);
      onToast?.("Website reset to defaults");
    } catch (err) {
      setError(err.message);
      onToast?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error && !site) {
    return (
      <div className="rounded-2xl border border-sh-chili/40 bg-sh-chili/10 p-6 max-w-xl">
        <p className="font-display text-2xl uppercase tracking-tight text-sh-chili">Cannot load website</p>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">{error}</p>
        <ol className="mt-4 space-y-1 text-sm text-white/55 list-decimal list-inside">
          <li>In this project folder run <code className="text-sh-saffron">npm run dev</code></li>
          <li>
            Open admin at{" "}
            <a className="text-sh-saffron underline" href="http://localhost:5174/admin">
              http://localhost:5174/admin
            </a>
          </li>
          <li>Do not use port 5173 — that may be another website on your PC</li>
        </ol>
        <button
          type="button"
          onClick={load}
          className="mt-5 rounded-xl bg-sh-saffron text-[#0c0b0a] px-4 py-2.5 text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex items-center gap-3 text-white/40 py-10">
        <div className="w-6 h-6 border-2 border-sh-saffron/30 border-t-sh-saffron rounded-full animate-spin" />
        Loading website…
      </div>
    );
  }

  const tab = TABS.find((t) => t.id === section) || TABS[0];

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="rounded-2xl border border-white/10 bg-[#161310] p-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white/90">Homepage content</p>
          <p className="text-xs text-white/40 mt-0.5">
            {dirty ? "Unsaved changes" : "All changes saved"}
            {loadedAt ? ` · Last update ${new Date(loadedAt).toLocaleString()}` : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            dirty ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300"
          }`}
        >
          {dirty ? "Draft" : "Saved"}
        </span>
        <button
          type="button"
          onClick={resetDefaults}
          disabled={saving}
          className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/50 hover:text-white/80"
        >
          Reset defaults
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-xl bg-sh-saffron text-[#0c0b0a] px-4 py-2 text-sm font-semibold disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save website"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              if (t.id === "json") setJson(JSON.stringify(site, null, 2));
              setSection(t.id);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              section === t.id
                ? "bg-sh-saffron text-[#0c0b0a]"
                : "bg-white/5 text-white/55 hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-sh-chili/30 bg-sh-chili/10 px-4 py-3 text-sm text-sh-chili">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#161310] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="font-display text-2xl uppercase tracking-tight">{tab.label}</p>
          <p className="text-sm text-white/40 mt-1">{tab.hint}</p>
        </div>

        <div className="p-5 space-y-5">
          {section === "json" ? (
            <>
              <p className="text-sm text-white/45">
                Every word on the homepage lives here. Edit carefully, then save. Invalid JSON will not save.
              </p>
              <textarea
                className="w-full min-h-[65vh] rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs leading-relaxed outline-none focus:border-sh-saffron"
                value={json}
                onChange={(e) => setJson(e.target.value)}
                spellCheck={false}
              />
            </>
          ) : null}

          {section === "hero" && (
            <>
              <Field label="Brand name">
                <input
                  className="input"
                  value={site.brand?.name || ""}
                  onChange={(e) => setPath("brand.name", e.target.value)}
                />
              </Field>
              <Field label="Hindi / script">
                <input
                  className="input"
                  value={site.brand?.hindi || ""}
                  onChange={(e) => setPath("brand.hindi", e.target.value)}
                />
              </Field>
              <Bi label="Headline" value={site.hero?.headline} onChange={(v) => setPath("hero.headline", v)} />
              <Bi label="Subhead" value={site.hero?.subhead} onChange={(v) => setPath("hero.subhead", v)} />
              <Bi label="Tags" value={site.hero?.tags} onChange={(v) => setPath("hero.tags", v)} />
              <Paras
                label="Intro paragraphs"
                value={site.hero?.paragraphs}
                onChange={(v) => setPath("hero.paragraphs", v)}
              />
              <Bi label="Brand tagline" value={site.brand?.tagline} onChange={(v) => setPath("brand.tagline", v)} />
              <Bi
                label="Footer line"
                value={site.brand?.footerLine}
                onChange={(v) => setPath("brand.footerLine", v)}
              />
              <Bi
                label="Footer copyright (use {{year}})"
                value={site.footer?.copyright}
                onChange={(v) => setPath("footer.copyright", v)}
              />
            </>
          )}

          {section === "nav" && (
            <>
              <Bi label="Book button" value={site.nav?.book} onChange={(v) => setPath("nav.book", v)} />
              <Bi
                label="Order takeaway button"
                value={site.nav?.orderTakeaway}
                onChange={(v) => setPath("nav.orderTakeaway", v)}
              />
              <p className="text-xs uppercase tracking-[0.14em] text-white/40">Nav links</p>
              {(site.nav?.links || []).map((link, i) => (
                <div key={link.id || i} className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-3">
                  <Bi
                    label="Label"
                    value={link.label}
                    onChange={(label) => {
                      const next = [...(site.nav?.links || [])];
                      next[i] = { ...link, label };
                      setPath("nav.links", next);
                    }}
                  />
                  <Field label="Href (e.g. #restaurant)">
                    <input
                      className="input"
                      value={link.href || ""}
                      onChange={(e) => {
                        const next = [...(site.nav?.links || [])];
                        next[i] = { ...link, href: e.target.value };
                        setPath("nav.links", next);
                      }}
                    />
                  </Field>
                </div>
              ))}
            </>
          )}

          {section === "restaurant" && (
            <>
              <Bi label="Eyebrow" value={site.restaurant?.eyebrow} onChange={(v) => setPath("restaurant.eyebrow", v)} />
              <Bi label="Title" value={site.restaurant?.title} onChange={(v) => setPath("restaurant.title", v)} />
              <Bi label="Lead" value={site.restaurant?.lead} onChange={(v) => setPath("restaurant.lead", v)} />
              <Paras
                label="Body"
                value={site.restaurant?.paragraphs}
                onChange={(v) => setPath("restaurant.paragraphs", v)}
              />
              <Field label="Address line">
                <input
                  className="input"
                  value={site.restaurant?.addressLine || ""}
                  onChange={(e) => setPath("restaurant.addressLine", e.target.value)}
                />
              </Field>
              <Bi label="Book CTA" value={site.restaurant?.ctaBook} onChange={(v) => setPath("restaurant.ctaBook", v)} />
              <Bi label="Menu CTA" value={site.restaurant?.ctaMenu} onChange={(v) => setPath("restaurant.ctaMenu", v)} />
            </>
          )}

          {section === "takeaway" && (
            <>
              <Bi label="Eyebrow" value={site.takeaway?.eyebrow} onChange={(v) => setPath("takeaway.eyebrow", v)} />
              <Bi label="Title" value={site.takeaway?.title} onChange={(v) => setPath("takeaway.title", v)} />
              <Bi label="Lead" value={site.takeaway?.lead} onChange={(v) => setPath("takeaway.lead", v)} />
              <Paras
                label="Body"
                value={site.takeaway?.paragraphs}
                onChange={(v) => setPath("takeaway.paragraphs", v)}
              />
              <Field label="Address line">
                <input
                  className="input"
                  value={site.takeaway?.addressLine || ""}
                  onChange={(e) => setPath("takeaway.addressLine", e.target.value)}
                />
              </Field>
              <Bi label="Order CTA" value={site.takeaway?.ctaOrder} onChange={(v) => setPath("takeaway.ctaOrder", v)} />
              <Bi label="Menu CTA" value={site.takeaway?.ctaMenu} onChange={(v) => setPath("takeaway.ctaMenu", v)} />
            </>
          )}

          {section === "menuGuide" && (
            <>
              <Bi label="Eyebrow" value={site.menuGuide?.eyebrow} onChange={(v) => setPath("menuGuide.eyebrow", v)} />
              <Bi label="Title" value={site.menuGuide?.title} onChange={(v) => setPath("menuGuide.title", v)} />
              <Bi
                label="Restaurant menu CTA"
                value={site.menuGuide?.ctaRestaurant}
                onChange={(v) => setPath("menuGuide.ctaRestaurant", v)}
              />
              <Bi
                label="Takeaway menu CTA"
                value={site.menuGuide?.ctaTakeaway}
                onChange={(v) => setPath("menuGuide.ctaTakeaway", v)}
              />
              <Chapters
                chapters={site.menuGuide?.chapters || []}
                onChange={(chapters) => setPath("menuGuide.chapters", chapters)}
              />
            </>
          )}

          {section === "guide" && (
            <>
              <Bi label="Eyebrow" value={site.guide?.eyebrow} onChange={(v) => setPath("guide.eyebrow", v)} />
              <Bi label="Title" value={site.guide?.title} onChange={(v) => setPath("guide.title", v)} />
              <Paras label="Tips" value={site.guide?.paragraphs} onChange={(v) => setPath("guide.paragraphs", v)} />
            </>
          )}

          {section === "reviews" && (
            <>
              <Bi label="Eyebrow" value={site.reviews?.eyebrow} onChange={(v) => setPath("reviews.eyebrow", v)} />
              <Bi label="Title" value={site.reviews?.title} onChange={(v) => setPath("reviews.title", v)} />
              <Bi
                label="Restaurant note"
                value={site.reviews?.restaurantNote}
                onChange={(v) => setPath("reviews.restaurantNote", v)}
              />
              <Bi
                label="Restaurant score"
                value={site.reviews?.restaurantScore}
                onChange={(v) => setPath("reviews.restaurantScore", v)}
              />
              <Bi
                label="Takeaway note"
                value={site.reviews?.takeawayNote}
                onChange={(v) => setPath("reviews.takeawayNote", v)}
              />
              <Bi
                label="Takeaway score"
                value={site.reviews?.takeawayScore}
                onChange={(v) => setPath("reviews.takeawayScore", v)}
              />
              <Bi label="Footnote" value={site.reviews?.footnote} onChange={(v) => setPath("reviews.footnote", v)} />
              <Quotes
                quotes={site.reviews?.quotes || []}
                onChange={(quotes) => setPath("reviews.quotes", quotes)}
              />
            </>
          )}

          {section === "phones" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-display text-xl uppercase tracking-tight">Restaurant · Viale Toscana</h3>
                <Bi
                  label="Eyebrow"
                  value={site.locations?.restaurant?.eyebrow}
                  onChange={(v) => setPath("locations.restaurant.eyebrow", v)}
                />
                <Field label="Title / street">
                  <input
                    className="input"
                    value={site.locations?.restaurant?.title || ""}
                    onChange={(e) => setPath("locations.restaurant.title", e.target.value)}
                  />
                </Field>
                <Field label="Area / CAP">
                  <input
                    className="input"
                    value={site.locations?.restaurant?.area || ""}
                    onChange={(e) => setPath("locations.restaurant.area", e.target.value)}
                  />
                </Field>
                <Phones
                  phones={site.locations?.restaurant?.phones || []}
                  onChange={(phones) => setPath("locations.restaurant.phones", phones)}
                />
                <Bi
                  label="Hours label"
                  value={site.locations?.restaurant?.hoursLabel}
                  onChange={(v) => setPath("locations.restaurant.hoursLabel", v)}
                />
                <Hours
                  hours={site.locations?.restaurant?.hours || []}
                  onChange={(hours) => setPath("locations.restaurant.hours", hours)}
                />
                <Bi
                  label="Note"
                  value={site.locations?.restaurant?.note}
                  onChange={(v) => setPath("locations.restaurant.note", v)}
                />
                <Bi
                  label="Call CTA"
                  value={site.locations?.restaurant?.ctaCall}
                  onChange={(v) => setPath("locations.restaurant.ctaCall", v)}
                />
                <Bi
                  label="Maps CTA"
                  value={site.locations?.restaurant?.ctaMaps}
                  onChange={(v) => setPath("locations.restaurant.ctaMaps", v)}
                />
                <Field label="Google Maps URL">
                  <input
                    className="input"
                    value={site.locations?.restaurant?.maps || ""}
                    onChange={(e) => setPath("locations.restaurant.maps", e.target.value)}
                  />
                </Field>
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl uppercase tracking-tight">Takeaway · Porta Romana</h3>
                <Bi
                  label="Eyebrow"
                  value={site.locations?.takeaway?.eyebrow}
                  onChange={(v) => setPath("locations.takeaway.eyebrow", v)}
                />
                <Field label="Title / street">
                  <input
                    className="input"
                    value={site.locations?.takeaway?.title || ""}
                    onChange={(e) => setPath("locations.takeaway.title", e.target.value)}
                  />
                </Field>
                <Field label="Area / CAP">
                  <input
                    className="input"
                    value={site.locations?.takeaway?.area || ""}
                    onChange={(e) => setPath("locations.takeaway.area", e.target.value)}
                  />
                </Field>
                <Phones
                  phones={site.locations?.takeaway?.phones || []}
                  onChange={(phones) => setPath("locations.takeaway.phones", phones)}
                />
                <Bi
                  label="Hours label"
                  value={site.locations?.takeaway?.hoursLabel}
                  onChange={(v) => setPath("locations.takeaway.hoursLabel", v)}
                />
                <Hours
                  hours={site.locations?.takeaway?.hours || []}
                  onChange={(hours) => setPath("locations.takeaway.hours", hours)}
                />
                <Bi
                  label="Note"
                  value={site.locations?.takeaway?.note}
                  onChange={(v) => setPath("locations.takeaway.note", v)}
                />
                <Bi
                  label="Note 2"
                  value={site.locations?.takeaway?.note2}
                  onChange={(v) => setPath("locations.takeaway.note2", v)}
                />
                <Bi
                  label="Call CTA"
                  value={site.locations?.takeaway?.ctaCall}
                  onChange={(v) => setPath("locations.takeaway.ctaCall", v)}
                />
                <Bi
                  label="Order CTA"
                  value={site.locations?.takeaway?.ctaOrder}
                  onChange={(v) => setPath("locations.takeaway.ctaOrder", v)}
                />
                <Bi
                  label="Maps CTA"
                  value={site.locations?.takeaway?.ctaMaps}
                  onChange={(v) => setPath("locations.takeaway.ctaMaps", v)}
                />
                <Field label="Order online URL">
                  <input
                    className="input"
                    value={site.locations?.takeaway?.orderUrl || ""}
                    onChange={(e) => setPath("locations.takeaway.orderUrl", e.target.value)}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Google Maps URL">
                  <input
                    className="input"
                    value={site.locations?.takeaway?.maps || ""}
                    onChange={(e) => setPath("locations.takeaway.maps", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {section !== "json" && (
            <div className="pt-2 flex flex-wrap gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={save}
                disabled={saving || !dirty}
                className="rounded-xl bg-sh-saffron text-[#0c0b0a] px-5 py-3 text-sm font-semibold disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save website"}
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70 hover:border-sh-saffron/50"
              >
                Open homepage
              </a>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-white/30">
        Storage: free local JSON file (<code className="text-white/45">data/site-store.json</code>) — no database
        required. Defaults from siteDefault.js.
        {SITE_DEFAULT?.version ? ` · schema v${SITE_DEFAULT.version}` : ""}
      </p>

      <style>{`
        .input {
          margin-top: 0.35rem;
          width: 100%;
          border-radius: 0.75rem;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.7rem 0.85rem;
          outline: none;
          color: inherit;
        }
        .input:focus { border-color: #e8a317; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
      {label}
      <div className="normal-case tracking-normal text-[#f2ede6]">{children}</div>
    </label>
  );
}

function Bi({ label, value, onChange }) {
  const v = value && typeof value === "object" ? value : { en: value || "", it: "" };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label={`${label} · EN`}>
        <textarea
          className="input min-h-[72px]"
          value={v.en || ""}
          onChange={(e) => onChange({ ...v, en: e.target.value })}
        />
      </Field>
      <Field label={`${label} · IT`}>
        <textarea
          className="input min-h-[72px]"
          value={v.it || ""}
          onChange={(e) => onChange({ ...v, it: e.target.value })}
        />
      </Field>
    </div>
  );
}

function Paras({ label, value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const en = list.map((p) => p?.en || "").join("\n\n");
  const it = list.map((p) => p?.it || "").join("\n\n");
  const apply = (lang, text) => {
    const chunks = text
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const max = Math.max(chunks.length, list.length);
    const next = Array.from({ length: max }, (_, i) => ({
      en: lang === "en" ? chunks[i] || "" : list[i]?.en || "",
      it: lang === "it" ? chunks[i] || "" : list[i]?.it || "",
    })).filter((p) => p.en || p.it);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/35">Separate paragraphs with a blank line</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={`${label} · EN`}>
          <textarea className="input min-h-[160px]" value={en} onChange={(e) => apply("en", e.target.value)} />
        </Field>
        <Field label={`${label} · IT`}>
          <textarea className="input min-h-[160px]" value={it} onChange={(e) => apply("it", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function Chapters({ chapters, onChange }) {
  const update = (i, patch) => {
    const next = chapters.map((ch, idx) => (idx === i ? { ...ch, ...patch } : ch));
    onChange(next);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-white/40">Menu intro cards</p>
        <button
          type="button"
          className="text-sm font-semibold text-sh-saffron"
          onClick={() =>
            onChange([...chapters, { title: { en: "New section", it: "Nuova sezione" }, body: { en: "", it: "" } }])
          }
        >
          + Add card
        </button>
      </div>
      {chapters.map((ch, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-sh-saffron font-semibold uppercase tracking-wider">
              Card {String(i + 1).padStart(2, "0")}
            </p>
            <button
              type="button"
              className="text-xs text-sh-chili"
              onClick={() => onChange(chapters.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
          <Bi label="Title" value={ch.title} onChange={(title) => update(i, { title })} />
          <Bi label="Body" value={ch.body} onChange={(body) => update(i, { body })} />
        </div>
      ))}
    </div>
  );
}

function Phones({ phones, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.14em] text-white/40">Phones</p>
      {phones.map((p, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="input mt-0"
            value={p.display || ""}
            placeholder="+39 02 …"
            onChange={(e) => {
              const display = e.target.value;
              const next = [...phones];
              next[i] = { display, tel: `tel:${display.replace(/[^\d+]/g, "")}` };
              onChange(next);
            }}
          />
          <button
            type="button"
            className="text-sh-chili text-sm px-2 shrink-0"
            onClick={() => onChange(phones.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-sh-saffron font-semibold"
        onClick={() => onChange([...phones, { display: "", tel: "tel:" }])}
      >
        + Add phone
      </button>
    </div>
  );
}

function Hours({ hours, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-white/40">Hours</p>
        <button
          type="button"
          className="text-sm text-sh-saffron font-semibold"
          onClick={() =>
            onChange([...hours, { label: { en: "", it: "" }, value: { en: "", it: "" }, closed: false }])
          }
        >
          + Add row
        </button>
      </div>
      {hours.map((h, i) => {
        const labelEn = typeof h.label === "object" ? h.label?.en || "" : h.label || "";
        const labelIt = typeof h.label === "object" ? h.label?.it || "" : "";
        const valueEn = typeof h.value === "object" ? h.value?.en || "" : h.value || "";
        const valueIt = typeof h.value === "object" ? h.value?.it || "" : typeof h.value === "string" ? h.value : "";
        return (
          <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-3 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                className="input mt-0"
                placeholder="Label EN"
                value={labelEn}
                onChange={(e) => {
                  const next = [...hours];
                  next[i] = { ...h, label: { en: e.target.value, it: labelIt || e.target.value } };
                  onChange(next);
                }}
              />
              <input
                className="input mt-0"
                placeholder="Label IT"
                value={labelIt}
                onChange={(e) => {
                  const next = [...hours];
                  next[i] = { ...h, label: { en: labelEn, it: e.target.value } };
                  onChange(next);
                }}
              />
              <input
                className="input mt-0"
                placeholder="Times EN / Closed"
                value={valueEn}
                onChange={(e) => {
                  const next = [...hours];
                  const closed = /closed|chiuso/i.test(e.target.value);
                  next[i] = {
                    ...h,
                    closed,
                    value: { en: e.target.value, it: valueIt || e.target.value },
                  };
                  onChange(next);
                }}
              />
              <input
                className="input mt-0"
                placeholder="Times IT / Chiuso"
                value={valueIt}
                onChange={(e) => {
                  const next = [...hours];
                  const closed = /closed|chiuso/i.test(e.target.value);
                  next[i] = {
                    ...h,
                    closed,
                    value: { en: valueEn, it: e.target.value },
                  };
                  onChange(next);
                }}
              />
            </div>
            <button
              type="button"
              className="text-sh-chili text-xs"
              onClick={() => onChange(hours.filter((_, j) => j !== i))}
            >
              Remove row
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Quotes({ quotes, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-white/40">Customer quotes</p>
        <button
          type="button"
          className="text-sm font-semibold text-sh-saffron"
          onClick={() =>
            onChange([
              ...quotes,
              { text: { en: "", it: "" }, author: "", source: "" },
            ])
          }
        >
          + Add quote
        </button>
      </div>
      {quotes.map((q, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-3">
          <Bi
            label="Quote"
            value={q.text}
            onChange={(text) => {
              const next = [...quotes];
              next[i] = { ...q, text };
              onChange(next);
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="Author">
              <input
                className="input"
                value={q.author || ""}
                onChange={(e) => {
                  const next = [...quotes];
                  next[i] = { ...q, author: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
            <Field label="Source">
              <input
                className="input"
                value={q.source || ""}
                onChange={(e) => {
                  const next = [...quotes];
                  next[i] = { ...q, source: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <button
            type="button"
            className="text-xs text-sh-chili"
            onClick={() => onChange(quotes.filter((_, j) => j !== i))}
          >
            Remove quote
          </button>
        </div>
      ))}
    </div>
  );
}
