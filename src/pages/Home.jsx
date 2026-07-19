import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import RatingsBand from "../components/RatingsBand";
import Story from "../components/Story";
import SpiceWall from "../components/SpiceWall";
import Signatures from "../components/Signatures";
import Atmosphere from "../components/Atmosphere";
import Reviews from "../components/Reviews";
import Visit from "../components/Visit";
import Reserve from "../components/Reserve";
import Footer from "../components/Footer";
import LoaderCurtain from "../components/LoaderCurtain";
import ScrollProgress from "../components/ScrollProgress";

export default function Home() {
  return (
    <>
      <LoaderCurtain />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <RatingsBand />
        <Story />
        <SpiceWall />
        <Signatures />
        <MarqueeStrip variant="outline" />
        <Atmosphere />
        <Reviews />
        <Visit />
        <Reserve />
      </main>
      <Footer />
    </>
  );
}
