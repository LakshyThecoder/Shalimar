import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/** Pin page scroll — only the admin content pane scrolls */
function useAdminScrollLock(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [enabled]);
}
import {
  adminDeletePhoto,
  adminGetMenu,
  adminLogin,
  adminLogout,
  adminMe,
  adminSaveMenu,
  adminUploadPhoto,
  sectionTitle,
} from "../lib/menuApi";
import AdminSiteEditor from "./AdminSiteEditor";
import Seo from "../components/Seo";

const emptyItem = () => ({
  id: `item-${Date.now()}`,
  name: "",
  price: 0,
  spicy: false,
  available: true,
  image: "",
  desc: { it: "", en: "" },
  includes: [],
});

const emptySection = () => ({
  id: `cat-${Date.now()}`,
  label: { it: "Nuova categoria", en: "New category" },
  noteKey: null,
  note: { it: "", en: "" },
  featured: false,
  isSetMenu: false,
  image: "",
  items: [],
});

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  useAdminScrollLock(Boolean(user));
  const [username, setUsername] = useState("Shalimar");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("website");
  const [branch, setBranch] = useState("restaurant");
  /** Per-branch menus so switching tabs never wipes unsaved work */
  const [menus, setMenus] = useState({ restaurant: null, takeaway: null });
  const [baselines, setBaselines] = useState({ restaurant: "", takeaway: "" });
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const sections = menus[branch] || [];
  const menuDirty =
    menus[branch] != null && JSON.stringify(menus[branch]) !== baselines[branch];

  useEffect(() => {
    adminMe()
      .then((r) => setUser(r.username))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!user || tab !== "menu") return;
    if (menus[branch] != null) return; // keep local edits
    setLoading(true);
    adminGetMenu(branch)
      .then((data) => {
        const secs = data.sections || [];
        setMenus((m) => ({ ...m, [branch]: secs }));
        setBaselines((b) => ({ ...b, [branch]: JSON.stringify(secs) }));
        setActiveSectionId((id) => id || secs[0]?.id || null);
      })
      .catch((err) => setToast(err.message))
      .finally(() => setLoading(false));
  }, [user, branch, tab, menus]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const setSections = (updater) => {
    setMenus((m) => {
      const prev = m[branch] || [];
      const next = typeof updater === "function" ? updater(prev) : updater;
      return { ...m, [branch]: next };
    });
  };

  const goTab = (nextTab, nextBranch = branch) => {
    if (tab === "menu" && menuDirty && (nextTab !== "menu" || nextBranch !== branch)) {
      if (!confirm("You have unsaved menu changes. Leave without saving?")) return;
    }
    if (nextTab === "menu") {
      setBranch(nextBranch);
      setActiveSectionId(null);
    }
    setTab(nextTab);
  };

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) || null,
    [sections, activeSectionId]
  );

  const login = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const r = await adminLogin(username, password);
      setUser(r.username);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const logout = async () => {
    await adminLogout().catch(() => {});
    setUser(null);
  };

  const patchSection = (sectionId, patch) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
  };

  const patchItem = (sectionId, itemId, patch) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
        };
      })
    );
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      const r = await adminSaveMenu(branch, sections);
      const saved = r.sections || sections;
      setMenus((m) => ({ ...m, [branch]: saved }));
      setBaselines((b) => ({ ...b, [branch]: JSON.stringify(saved) }));
      setToast("Menu saved — open Preview to see it");
    } catch (err) {
      setToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file, onUrl) => {
    if (!file) return;
    try {
      setToast("Compressing photo…");
      const r = await adminUploadPhoto(file);
      onUrl(r.url);
      setToast(
        `Photo compressed to ${r.savedLabel || "ok"} — remember to Save menu`
      );
    } catch (err) {
      setToast(err.message);
    }
  };

  const clearPhoto = async (url, onCleared) => {
    onCleared();
    try {
      await adminDeletePhoto(url);
    } catch {
      /* local clear still OK */
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0c0b0a] text-[#f2ede6] flex items-center justify-center">
        <Seo routeKey="home" noindex pathOverride="/admin" />
        <div className="w-8 h-8 border-2 border-sh-saffron/30 border-t-sh-saffron rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0b0a] text-[#f2ede6] flex items-center justify-center p-4">
        <Seo routeKey="home" noindex pathOverride="/admin" titleOverride="Admin · Shalimar" />
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161310] p-8 shadow-2xl"
        >
          <p className="font-editorial italic text-sh-saffron text-lg">शालिमार</p>
          <h1 className="mt-1 font-display text-4xl uppercase tracking-tight">Admin</h1>
          <p className="mt-2 text-sm text-white/50">Edit the website and menus in one place.</p>
          <p className="mt-1 text-xs text-white/35">
            Live site needs Vercel Blob storage connected. Local: localhost:5174/admin
          </p>

          <label className="mt-8 block text-xs uppercase tracking-[0.16em] text-white/45">
            ID
            <input
              className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-sh-saffron"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-white/45">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-sh-saffron"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="mt-3 text-sm text-sh-chili">{loginError}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-sh-saffron text-[#0c0b0a] py-3.5 text-sm font-semibold tracking-wide hover:brightness-110 transition"
          >
            Sign in
          </button>
          <Link to="/" className="mt-4 block text-center text-sm text-white/40 hover:text-sh-saffron">
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-[#0c0b0a] text-[#f2ede6] flex">
      <Seo routeKey="home" noindex pathOverride="/admin" titleOverride="Admin · Shalimar" />
      {/* Left panel — fixed, never scrolls */}
      <aside className="hidden md:flex w-60 shrink-0 h-full flex-col border-r border-white/10 bg-[#12100e]">
        <div className="p-5 border-b border-white/10 shrink-0">
          <p className="font-editorial italic text-sh-saffron text-sm">शालिमार</p>
          <p className="font-display text-2xl uppercase tracking-tight">Shalimar</p>
          <p className="text-xs text-white/40 mt-1">Signed in as {user}</p>
        </div>
        <nav className="p-3 flex-1 space-y-1 min-h-0">
          <NavBtn active={tab === "website"} onClick={() => goTab("website")}>
            Website
          </NavBtn>
          <NavBtn
            active={tab === "menu" && branch === "restaurant"}
            onClick={() => goTab("menu", "restaurant")}
          >
            Restaurant menu
            {menus.restaurant != null &&
              JSON.stringify(menus.restaurant) !== baselines.restaurant && (
                <span className="ms-1 text-amber-300">•</span>
              )}
          </NavBtn>
          <NavBtn
            active={tab === "menu" && branch === "takeaway"}
            onClick={() => goTab("menu", "takeaway")}
          >
            Takeaway menu
            {menus.takeaway != null &&
              JSON.stringify(menus.takeaway) !== baselines.takeaway && (
                <span className="ms-1 text-amber-300">•</span>
              )}
          </NavBtn>
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
          <Link
            to="/"
            className="block rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            Open website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full text-start rounded-xl px-3 py-2.5 text-sm text-white/40 hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Right column */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        <header className="shrink-0 z-30 border-b border-white/10 bg-[#0c0b0a] px-4 md:px-6 py-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2 md:hidden overflow-x-auto">
            <Chip active={tab === "website"} onClick={() => goTab("website")}>
              Website
            </Chip>
            <Chip
              active={tab === "menu" && branch === "restaurant"}
              onClick={() => goTab("menu", "restaurant")}
            >
              Restaurant
            </Chip>
            <Chip
              active={tab === "menu" && branch === "takeaway"}
              onClick={() => goTab("menu", "takeaway")}
            >
              Takeaway
            </Chip>
          </div>
          <div className="hidden md:block">
            <h1 className="font-display text-2xl uppercase tracking-tight">
              {tab === "website"
                ? "Website"
                : branch === "restaurant"
                  ? "Restaurant menu"
                  : "Takeaway menu"}
            </h1>
            <p className="text-xs text-white/40">
              {tab === "website"
                ? "Change any text, phone or hours on the homepage"
                : menuDirty
                  ? "Unsaved changes — click Save menu"
                  : "Edit categories, dishes and photos"}
            </p>
          </div>
          <div className="flex items-center gap-2 ms-auto">
            {tab === "menu" && (
              <button
                type="button"
                onClick={saveMenu}
                disabled={saving || !menuDirty}
                className="rounded-xl bg-sh-saffron text-[#0c0b0a] px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving…" : menuDirty ? "Save menu" : "Saved"}
              </button>
            )}
            <a
              href={tab === "menu" ? "/menu" : "/"}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/70 hover:border-sh-saffron/50"
            >
              Preview
            </a>
          </div>
        </header>

        {toast && (
          <div className="shrink-0 mx-4 md:mx-6 mt-3 rounded-xl bg-sh-saffron/15 border border-sh-saffron/30 px-4 py-2.5 text-sm text-sh-saffron">
            {toast}
          </div>
        )}

        {/* ONLY this area scrolls */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6">
          {tab === "website" ? (
            <AdminSiteEditor onToast={setToast} />
          ) : loading ? (
            <p className="text-white/40">Loading menu…</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 lg:gap-6">
              <div className="rounded-2xl border border-white/10 bg-[#161310] p-3 h-fit lg:sticky lg:top-0">
                <div className="flex items-center justify-between px-2 py-2 mb-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">Categories</p>
                  <button
                    type="button"
                    onClick={() => {
                      const s = emptySection();
                      setSections((prev) => [...prev, s]);
                      setActiveSectionId(s.id);
                    }}
                    className="text-xs font-semibold text-sh-saffron"
                  >
                    + Add
                  </button>
                </div>
                <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setActiveSectionId(s.id)}
                        className={`w-full text-start rounded-xl px-3 py-2.5 transition ${
                          activeSectionId === s.id
                            ? "bg-sh-saffron/15 text-sh-saffron"
                            : "hover:bg-white/5 text-white/80"
                        }`}
                      >
                        <span className="block text-sm font-medium truncate">
                          {sectionTitle(s, "en")}
                        </span>
                        <span className="text-xs text-white/35">
                          {s.items?.length || 0} dishes
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                {!activeSection ? (
                  <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/40">
                    Select a category, or add a new one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <section className="rounded-2xl border border-white/10 bg-[#161310] p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-display text-3xl uppercase tracking-tight">Category</h2>
                        <button
                          type="button"
                          className="text-sm text-sh-chili"
                          onClick={() => {
                            if (!confirm("Delete this category and its dishes?")) return;
                            setSections((prev) => prev.filter((s) => s.id !== activeSection.id));
                            setActiveSectionId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Name (Italian)">
                          <input
                            className="input"
                            value={activeSection.label?.it || ""}
                            onChange={(e) =>
                              patchSection(activeSection.id, {
                                label: { ...activeSection.label, it: e.target.value },
                              })
                            }
                          />
                        </Field>
                        <Field label="Name (English)">
                          <input
                            className="input"
                            value={activeSection.label?.en || ""}
                            onChange={(e) =>
                              patchSection(activeSection.id, {
                                label: { ...activeSection.label, en: e.target.value },
                              })
                            }
                          />
                        </Field>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(activeSection.featured)}
                            onChange={(e) =>
                              patchSection(activeSection.id, { featured: e.target.checked })
                            }
                          />
                          Show as special
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(activeSection.isSetMenu)}
                            onChange={(e) =>
                              patchSection(activeSection.id, { isSetMenu: e.target.checked })
                            }
                          />
                          Set menu (includes list)
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Category note (Italian)">
                          <input
                            className="input"
                            value={
                              typeof activeSection.note === "object"
                                ? activeSection.note?.it || ""
                                : ""
                            }
                            placeholder="Optional short note under the title"
                            onChange={(e) =>
                              patchSection(activeSection.id, {
                                note: {
                                  en:
                                    typeof activeSection.note === "object"
                                      ? activeSection.note?.en || ""
                                      : "",
                                  it: e.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                        <Field label="Category note (English)">
                          <input
                            className="input"
                            value={
                              typeof activeSection.note === "object"
                                ? activeSection.note?.en || ""
                                : ""
                            }
                            placeholder="Optional short note under the title"
                            onChange={(e) =>
                              patchSection(activeSection.id, {
                                note: {
                                  it:
                                    typeof activeSection.note === "object"
                                      ? activeSection.note?.it || ""
                                      : "",
                                  en: e.target.value,
                                },
                              })
                            }
                          />
                        </Field>
                      </div>

                      <PhotoDrop
                        url={activeSection.image}
                        onUpload={(file) =>
                          upload(file, (url) => patchSection(activeSection.id, { image: url }))
                        }
                        onClear={() =>
                          clearPhoto(activeSection.image, () =>
                            patchSection(activeSection.id, { image: "" })
                          )
                        }
                        label="Category cover photo"
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn-ghost"
                          disabled={sections.findIndex((s) => s.id === activeSection.id) <= 0}
                          onClick={() => setSections((prev) => move(prev, activeSection.id, -1))}
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          disabled={
                            sections.findIndex((s) => s.id === activeSection.id) >=
                            sections.length - 1
                          }
                          onClick={() => setSections((prev) => move(prev, activeSection.id, 1))}
                        >
                          ↓ Down
                        </button>
                      </div>
                    </section>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <h3 className="font-display text-2xl uppercase tracking-tight">Dishes</h3>
                      <button
                        type="button"
                        className="rounded-xl border border-sh-saffron/40 text-sh-saffron px-3 py-2 text-sm font-semibold"
                        onClick={() =>
                          patchSection(activeSection.id, {
                            items: [...(activeSection.items || []), emptyItem()],
                          })
                        }
                      >
                        + Add dish
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(activeSection.items || []).map((item, idx) => (
                        <article
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-[#161310] p-4 md:p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Dish {idx + 1}
                            </p>
                            <button
                              type="button"
                              className="text-sm text-sh-chili"
                              onClick={() =>
                                patchSection(activeSection.id, {
                                  items: activeSection.items.filter((it) => it.id !== item.id),
                                })
                              }
                            >
                              Remove
                            </button>
                          </div>

                          <PhotoDrop
                            url={item.image}
                            onUpload={(file) =>
                              upload(file, (url) =>
                                patchItem(activeSection.id, item.id, { image: url })
                              )
                            }
                            onClear={() =>
                              clearPhoto(item.image, () =>
                                patchItem(activeSection.id, item.id, { image: "" })
                              )
                            }
                            label="Dish photo — tap or drop an image"
                            large
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                            <Field label="Dish name">
                              <input
                                className="input"
                                value={item.name}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, { name: e.target.value })
                                }
                              />
                            </Field>
                            <Field label="Price €">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                className="input"
                                value={item.price}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    price: Number(e.target.value) || 0,
                                  })
                                }
                              />
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Description IT">
                              <textarea
                                className="input min-h-[70px]"
                                value={item.desc?.it || ""}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    desc: { ...item.desc, it: e.target.value },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Description EN">
                              <textarea
                                className="input min-h-[70px]"
                                value={item.desc?.en || ""}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    desc: { ...item.desc, en: e.target.value },
                                  })
                                }
                              />
                            </Field>
                          </div>

                          {activeSection.isSetMenu && (
                            <Field label="Includes (one per line)">
                              <textarea
                                className="input min-h-[80px]"
                                value={(item.includes || []).join("\n")}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    includes: e.target.value
                                      .split("\n")
                                      .map((l) => l.trim())
                                      .filter(Boolean),
                                  })
                                }
                              />
                            </Field>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm">
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={Boolean(item.spicy)}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    spicy: e.target.checked,
                                  })
                                }
                              />
                              Spicy
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.available !== false}
                                onChange={(e) =>
                                  patchItem(activeSection.id, item.id, {
                                    available: e.target.checked,
                                  })
                                }
                              />
                              Available
                            </label>
                          </div>
                        </article>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={saveMenu}
                      disabled={saving || !menuDirty}
                      className="rounded-xl bg-sh-saffron text-[#0c0b0a] px-6 py-3 text-sm font-semibold disabled:opacity-50"
                    >
                      {saving ? "Saving…" : menuDirty ? "Save menu" : "Saved"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

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
        .btn-ghost {
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 0.45rem 0.85rem;
          font-size: 0.8rem;
        }
        .btn-ghost:disabled { opacity: 0.35; }
      `}</style>
    </div>
  );
}

function NavBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-start rounded-xl px-3 py-2.5 text-sm transition ${
        active ? "bg-sh-saffron/15 text-sh-saffron font-semibold" : "text-white/65 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active ? "bg-sh-saffron text-[#0c0b0a]" : "bg-white/5 text-white/60"
      }`}
    >
      {children}
    </button>
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

function PhotoDrop({ url, onUpload, onClear, label, large = false }) {
  const [drag, setDrag] = useState(false);

  const onFile = (file) => {
    if (file && file.type?.startsWith("image/")) onUpload(file);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/40 mb-2">{label}</p>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition ${
          drag
            ? "border-sh-saffron bg-sh-saffron/10"
            : url
              ? "border-white/15"
              : "border-white/20 hover:border-sh-saffron/50"
        } ${large ? "aspect-[16/9] max-h-56" : "aspect-[21/9] max-h-36"}`}
      >
        {url ? (
          <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-4">
            <span className="text-sh-saffron text-sm font-semibold">Add photo</span>
            <span className="text-xs text-white/40">Click or drop JPG / PNG</span>
          </div>
        )}
        {url && (
          <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition flex items-center justify-center">
            <span className="text-sm font-semibold text-white">Change photo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {url && (
        <button type="button" onClick={onClear} className="mt-2 text-xs text-white/40 hover:text-white/70">
          Remove photo
        </button>
      )}
    </div>
  );
}

function move(list, id, delta) {
  const i = list.findIndex((x) => x.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= list.length) return list;
  const next = [...list];
  const [row] = next.splice(i, 1);
  next.splice(j, 0, row);
  return next;
}
