import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MenuCarousel from "@/components/sections/MenuCarousel";
import Promo from "@/components/sections/Promo";
import BestWayToEat from "@/components/sections/BestWayToEat";
import AboutUs from "@/components/sections/AboutUs";
import BirthdayCookie from "@/components/sections/BirthdayCookie";
import OrderForm from "@/components/sections/OrderForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuCarousel />
        <Promo />
        <BestWayToEat />
        <AboutUs />
        <BirthdayCookie />
        <OrderForm />
      </main>
      <Footer />
    </>
  );
}
