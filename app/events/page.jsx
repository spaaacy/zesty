export const dynamic = "force-dynamic";
import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import EventsPage from "@/components/events/EventsPage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <EventsPage />
      <Footer />
    </div>
  );
}
