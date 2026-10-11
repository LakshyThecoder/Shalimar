import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchSite, normalizeSiteHours, tx, SITE_DEFAULT } from "../lib/siteApi";

const SiteContext = createContext({
  site: SITE_DEFAULT,
  lang: "en",
  t: (v) => tx(v, "en"),
  loading: true,
  fromApi: false,
  reload: () => {},
});

export function SiteProvider({ children }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("it") ? "it" : "en";
  const [site, setSite] = useState(() => normalizeSiteHours(structuredClone(SITE_DEFAULT)));
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  const reload = () => {
    setLoading(true);
    fetchSite()
      .then((data) => {
        setSite(data);
        // SITE_DEFAULT clone has no updatedAt from disk usually — treat any updatedAt as live
        setFromApi(Boolean(data?.updatedAt));
      })
      .catch(() => {
        setSite(normalizeSiteHours(structuredClone(SITE_DEFAULT)));
        setFromApi(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    const onFocus = () => reload();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const value = useMemo(
    () => ({
      site,
      lang,
      t: (v) => tx(v, lang),
      loading,
      fromApi,
      reload,
    }),
    [site, lang, loading, fromApi]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
