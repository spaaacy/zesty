"use client";

import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main></main>
      <Footer />
    </div>
  );
}
