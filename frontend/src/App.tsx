import Navbar from "./components/navbar";
import SwapInterface from "./components/SwapInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-6 pt-20">
        <SwapInterface />
      </main>
    </div>
  );
}
