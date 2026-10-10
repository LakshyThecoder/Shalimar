import { useParams } from "react-router-dom";
import MenuDisplay from "../components/menu/MenuDisplay";
import Seo from "../components/Seo";

/** QR menu — display only, WITH prices. /qrmenu/:branch opens that location directly. */
export default function QRMenuPage() {
  const { branch } = useParams();
  const initialBranch = branch === "takeaway" || branch === "restaurant" ? branch : null;
  return (
    <>
      <Seo
        routeKey="qrmenu"
        noindex
        pathOverride={branch ? `/qrmenu/${branch}` : "/qrmenu"}
      />
      <MenuDisplay showPrices={true} initialBranch={initialBranch} />
    </>
  );
}
