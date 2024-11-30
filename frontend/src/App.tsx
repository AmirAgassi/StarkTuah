import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import { useAccount } from "@starknet-react/core";

export default function App() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {isConnected ? <Dashboard /> : <Landing />}
    </div>
  );
}
