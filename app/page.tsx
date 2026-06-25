import FeaturedNews from "./components/FeaturedNews";
import Sidebar from "./components/Sidebar";
import BusinessCarousel from "./components/BusinessCarousel";
import LifestyleFeature from "./components/LifestyleFeature";
import SportSection from "./components/SportSection";
import LatestFromBlog from "./components/LatestFromBlog";

export const revalidate = 300;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4">
      <LatestFromBlog />
      {/* Top: featured + sidebar */}
      <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_320px]">
        <FeaturedNews />
        <Sidebar />
      </div>

      {/* Full-width sections */}
      <div className="mt-12 flex flex-col gap-12">
        <BusinessCarousel />
        <LifestyleFeature />
        <SportSection />
      </div>
    </main>
  );
}
