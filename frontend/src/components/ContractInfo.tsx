import { useReadContract } from "@starknet-react/core";
import { useState, useEffect } from "react";
import type { Abi } from "starknet";
export const CONTRACT_ADDRESS =
  "0x00c39533f4515a7253c10979bc1363d7d029ae01100f218fd49a65a5f66eabe5";

export const USDC_ADDRESS =
  "0x00f0abbe51aa1026c64b714f13e86d51d248729361a512f16f4c183db758939d";

// abi for total supply and decimals query
export const ABI = [
  {
    name: "total_supply",
    type: "function",
    inputs: [],
    outputs: [{ name: "total_supply", type: "felt" }],
    state_mutability: "view",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "decimals", type: "felt" }],
    state_mutability: "view",
  },
  {
    name: "balance_of",
    type: "function",
    inputs: [{ name: "account", type: "felt" }],
    outputs: [{ name: "balance", type: "felt" }],
    state_mutability: "view",
  },
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "recipient", type: "felt" },
      { name: "amount", type: "felt" },
    ],
    outputs: [{ name: "success", type: "felt" }],
    state_mutability: "external",
  },
  {
    name: "approve",
    type: "function",
    inputs: [
      { name: "spender", type: "felt" },
      { name: "amount", type: "felt" },
    ],
    outputs: [{ name: "success", type: "felt" }],
    state_mutability: "external",
  },
  {
    name: "allowance",
    type: "function",
    inputs: [
      { name: "owner", type: "felt" },
      { name: "spender", type: "felt" },
    ],
    outputs: [{ name: "remaining", type: "felt" }],
    state_mutability: "view",
  },
  {
    name: "mint",
    type: "function",
    inputs: [{ name: "amount", type: "core::integer::u256" }],
    outputs: [{ name: "success", type: "felt" }],
    state_mutability: "external",
  },
  {
    name: "burn",
    type: "function",
    inputs: [{ name: "amount", type: "felt" }],
    outputs: [{ name: "success", type: "felt" }],
    state_mutability: "external",
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      { name: "initial_supply", type: "felt" },
      { name: "recipient", type: "felt" },
    ],
    outputs: [],
  },
  {
    name: "transfer_from",
    type: "function",
    inputs: [
      { name: "sender", type: "felt" },
      { name: "recipient", type: "felt" },
      { name: "amount", type: "felt" },
    ],
    outputs: [{ name: "success", type: "felt" }],
    state_mutability: "external",
  },
] as const satisfies Abi;

export default function ContractInfo() {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);

  const { data: decimalsData } = useReadContract({
    functionName: "decimals",
    args: [],
    address: CONTRACT_ADDRESS,
    abi: ABI,
  });

  const { data: supplyData } = useReadContract({
    functionName: "total_supply",
    args: [],
    address: CONTRACT_ADDRESS,
    abi: ABI,
  });

  useEffect(() => {
    if (decimalsData && supplyData) {
      const decimalValue = Number(decimalsData.decimals);
      const supply = supplyData.total_supply;

      if (supply) {
        const formattedSupply = (
          Number(supply.toString()) / Math.pow(10, decimalValue)
        ).toLocaleString();
        setTotalSupply(formattedSupply);
      } else {
        setTotalSupply("0");
      }
    }
  }, [decimalsData, supplyData]);

  return (
    <div className="bg-[#1a1b23] p-4 rounded-lg border border-gray-600 mb-4">
      <h2 className="text-lg font-medium text-white mb-2">
        Contract Information
      </h2>
      <div className="text-[#7f8596]">
        <p>Contract Address: {CONTRACT_ADDRESS}</p>
        <p>Total Supply: {totalSupply ?? "Loading..."} tokens </p>
      </div>
    </div>
  );
}
