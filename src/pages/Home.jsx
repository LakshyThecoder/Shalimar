import Navbar from "../components/Navbar";
import HomeHero from "../components/site/HomeHero";
import PlaceBlock from "../components/site/PlaceBlock";
import MenuGuide from "../components/site/MenuGuide";
import OrderGuide from "../components/site/OrderGuide";
import SiteReviews from "../components/site/SiteReviews";
import SiteVisit from "../components/site/SiteVisit";
import SiteReserve from "../components/site/SiteReserve";
import SeoFaq from "../components/site/SeoFaq";
import SiteFooter from "../components/site/SiteFooter";
import LoaderCurtain from "../components/LoaderCurtain";
import ScrollProgress from "../components/ScrollProgress";
import Seo from "../components/Seo";

export default function Home() {
  return (
    <>
      <Seo routeKey="home" />
      <LoaderCurtain />
      <ScrollProgress />
      <Navbar />
      <main>
        <HomeHero />
        <PlaceBlock kind="restaurant" />
        <PlaceBlock kind="takeaway" />
        <MenuGuide />
        <OrderGuide />
        <SiteReviews />
        <SiteVisit />
        <SiteReserve />
        <SeoFaq />
      </main>
      <SiteFooter />
    </>
  );
}
