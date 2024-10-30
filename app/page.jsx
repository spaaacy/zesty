import Footer from "@/components/common/Footer";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingPage />
      <Footer />
    </div>
  );
}
