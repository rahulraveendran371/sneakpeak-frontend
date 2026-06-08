import HeroSection from "../components/Herosection";
import TrendingSlider from "../components/Trendslider";
import ShopByGender from "../components/Shopgender";
import ExploreProducts from "../components/Explore";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TrendingSlider />
      <ShopByGender />
      <ExploreProducts />
      <Footer />
    </div>
  );
}
