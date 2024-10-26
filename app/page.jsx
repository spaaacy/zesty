"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main></main>
      <Footer />
    </div>
  );
}
