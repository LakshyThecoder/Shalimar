import MenuDisplay from "../components/menu/MenuDisplay";
import Seo from "../components/Seo";

/** Website menu — display only, NO prices */
export default function MenuPage() {
  return (
    <>
      <Seo routeKey="menu" />
      <MenuDisplay showPrices={false} />
    </>
  );
}
