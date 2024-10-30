export const dynamic = "force-dynamic";
import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import Marketplace from "@/components/stores/Marketplace";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <Marketplace />
      <Footer />
    </div>
  );
}
