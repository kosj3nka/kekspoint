import Footer from "@/components/layout/Footer";
import FloatingNav from "@/components/layout/FloatingNav";
import Hero from "@/components/sections/Hero";
import Promo from "@/components/sections/Promo";
import BestWayToEat from "@/components/sections/BestWayToEat";
import AboutUs from "@/components/sections/AboutUs";
import BirthdayCookie from "@/components/sections/BirthdayCookie";
import OrderForm from "@/components/sections/OrderForm";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main>
        <Hero />
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
