import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Cursor from "./components/Cursor";
import SmoothScroll from "./components/SmoothScroll";
import LanguageWelcome from "./components/LanguageWelcome";
import GoogleTranslate from "./components/GoogleTranslate";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import QRMenuPage from "./pages/QRMenuPage";
import AdminPage from "./pages/AdminPage";
import { SiteProvider } from "./context/SiteContent";

function SiteChrome({ children }) {
  return (
    <SiteProvider>
      <GoogleTranslate />
      <LanguageWelcome />
      <Cursor />
      {children}
    </SiteProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/qrmenu/:branch?" element={<QRMenuPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <SiteChrome>
      <AnimatedRoutes />
    </SiteChrome>
  );
}

function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const shell = (
    <div
      className={`${
        isAdmin ? "h-dvh overflow-hidden" : "min-h-screen grain"
      } bg-sh-bg text-sh-text`}
    >
      <AppShell />
    </div>
  );

  // Admin needs normal browser scroll — Lenis fights sticky navs / wheel there
  if (isAdmin) return shell;
  return <SmoothScroll>{shell}</SmoothScroll>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  );
}
