import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Cursor from "./components/Cursor";
import SmoothScroll from "./components/SmoothScroll";
import LanguageWelcome from "./components/LanguageWelcome";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import QRMenuPage from "./pages/QRMenuPage";

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
          <Route path="/qrmenu" element={<QRMenuPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="grain min-h-screen bg-sh-bg text-sh-text">
          <LanguageWelcome />
          <Cursor />
          <AnimatedRoutes />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}
