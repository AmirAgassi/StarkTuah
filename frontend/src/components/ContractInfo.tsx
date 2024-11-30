import { useContract, useProvider } from "@starknet-react/core";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = "0x0771c943ac94b6778c0d7f8cbe1aa12962161cd40bcc37e8d5c45bb54625ce78";

// abi for total supply and decimals query
const ABI = [
  {
    name: "total_supply",
    type: "function",
    inputs: [],
    outputs: [{ name: "total_supply", type: "felt" }],
    state_mutability: "view"
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "decimals", type: "felt" }],
    state_mutability: "view"
  }
] as const;

export default function ContractInfo() {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [decimals, setDecimals] = useState<number>(18); // default to 18
  const provider = useProvider();
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  useEffect(() => {
    const fetchContractInfo = async () => {
      if (!contract) return;
      
      try {
        // Fetch decimals
        const decimalResult = await contract.call("decimals");
        const decimalValue = Number(decimalResult.decimals);
        setDecimals(decimalValue);

        // Fetch total supply
        const supplyResult = await contract.call("total_supply");
        const supply = supplyResult.total_supply;
        
        if (supply) {
          // Format the total supply with decimals
          const formattedSupply = (Number(supply.toString()) / Math.pow(10, decimalValue)).toLocaleString();
          setTotalSupply(formattedSupply);
        } else {
          setTotalSupply("0");
        }
      } catch (error) {
        console.error("Error fetching contract info:", error);
        setTotalSupply("Error fetching total supply");
      }
    };

    fetchContractInfo();
  }, [contract]);

  return (
    <div className="bg-[#1a1b23] p-4 rounded-lg border border-gray-600 mb-4">
      <h2 className="text-lg font-medium text-white mb-2">Contract Information</h2>
      <div className="text-[#7f8596]">
        <p>Contract Address: {CONTRACT_ADDRESS}</p>
        <p>Total Supply: {totalSupply ?? "Loading..."} tokens</p>
      </div>
    </div>
  );
}