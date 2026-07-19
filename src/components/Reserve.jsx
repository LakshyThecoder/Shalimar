import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import Magnetic from "./Magnetic";

const TIMES = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const SIZES = ["2", "3", "4", "5", "6", "7", "8+"];

export default function Reserve() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "20:00",
    guests: "2",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <section id="reserve" ref={ref} className="relative py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-sh-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-sh-chili font-semibold mb-5">
            {t("reserve.eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter">
            {t("reserve.title1")}
            <br />
            <span className="text-stroke-chili">{t("reserve.title2")}</span>
          </h2>
          <p className="font-editorial italic text-xl text-sh-muted mt-8 max-w-md">
            {t("reserve.lead")}{" "}
            <a href="tel:+393391785899" className="text-sh-saffron not-italic font-body text-base">
              +39 339 178 5899
            </a>
          </p>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {sent ? (
            <div className="border border-sh-saffron/40 bg-sh-bg/60 p-10 md:p-14">
              <p className="font-display text-4xl md:text-5xl uppercase text-sh-saffron">
                {t("reserve.sentTitle")}
              </p>
              <p className="font-editorial italic text-xl text-sh-muted mt-4">
                {t("reserve.sentBody", { name: form.name })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", phone: "", date: "", time: "20:00", guests: "2" });
                }}
                className="mt-8 text-xs uppercase tracking-[0.22em] text-sh-muted hover:text-sh-saffron transition-colors"
              >
                {t("reserve.another")} →
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-sh-muted">{t("reserve.name")}</span>
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  className="mt-2 w-full bg-sh-bg border border-sh-border px-4 py-3.5 text-sh-text outline-none focus:border-sh-saffron transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-sh-muted">{t("reserve.phone")}</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  className="mt-2 w-full bg-sh-bg border border-sh-border px-4 py-3.5 text-sh-text outline-none focus:border-sh-saffron transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-sh-muted">{t("reserve.date")}</span>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={update("date")}
                  className="mt-2 w-full bg-sh-bg border border-sh-border px-4 py-3.5 text-sh-text outline-none focus:border-sh-saffron transition-colors [color-scheme:dark]"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.2em] text-sh-muted">{t("reserve.guests")}</span>
                <select
                  value={form.guests}
                  onChange={update("guests")}
                  className="mt-2 w-full bg-sh-bg border border-sh-border px-4 py-3.5 text-sh-text outline-none focus:border-sh-saffron transition-colors"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {t("reserve.guestsLabel", { count: s })}
                    </option>
                  ))}
                </select>
              </label>
              <div className="md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-sh-muted">{t("reserve.time")}</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({ ...form, time })}
                      className={`px-4 py-2.5 text-xs uppercase tracking-[0.15em] border transition-all duration-300 ${
                        form.time === time
                          ? "bg-sh-saffron text-sh-bg border-sh-saffron"
                          : "border-sh-border text-sh-muted hover:border-sh-saffron hover:text-sh-saffron"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-sh-chili text-white px-10 py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#e84a22] disabled:opacity-60 transition-colors"
                  >
                    {loading ? t("reserve.sending") : t("reserve.submit")}
                    {!loading && <span aria-hidden>→</span>}
                  </button>
                </Magnetic>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
