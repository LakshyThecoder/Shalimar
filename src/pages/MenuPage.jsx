import MenuDisplay from "../components/menu/MenuDisplay";

/** Website menu — display only, NO prices */
export default function MenuPage() {
  return <MenuDisplay showPrices={false} />;
}
