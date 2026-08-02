import Footer from "@/components/layout/Footer";
import FloatingNav from "@/components/layout/FloatingNav";
import Hero from "@/components/sections/Hero";
import Promo from "@/components/sections/Promo";
import BestWayToEat from "@/components/sections/BestWayToEat";
import PhotoStrip from "@/components/sections/PhotoStrip";
import AboutUs from "@/components/sections/AboutUs";
import BirthdayCookie from "@/components/sections/BirthdayCookie";
import { getActiveMenuItems } from "@/lib/menu";

export default async function Home() {
  const items = await getActiveMenuItems();

  return (
    <>
      <FloatingNav />
      <main>
        <Hero items={items} />
        <Promo />
        <BestWayToEat />
        <PhotoStrip />
        <BirthdayCookie />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
