import { useAccount } from "@starknet-react/core";
import { ABI, CONTRACT_ADDRESS, USDC_ADDRESS } from "./ContractInfo";
import { useState, useEffect } from "react";
import {
  useReadContract,
  useSendTransaction,
  useContract,
} from "@starknet-react/core";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  token: string;
  label: string;
  isTopInput?: boolean;
  maxBalance?: string;
  onMint?: () => void;
}

const TokenInput = ({
  value,
  onChange,
  token,
  label,
  isTopInput = false,
  maxBalance,
  onMint,
}: TokenInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // only allow non-negative numbers with up to 6 decimal places
    if (
      newValue === "" ||
      (/^\d*\.?\d{0,6}$/.test(newValue) && Number(newValue) >= 0)
    ) {
      onChange(newValue);
    }
  };

  // Calculate USD value (1:1 for stablecoins)
  const usdValue = value
    ? `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "$0.00";

  const handleMaxClick = () => {
    if (maxBalance) {
      onChange(maxBalance);
    }
  };

  return (
    <div
      className={`bg-[#1a1b23] p-4 rounded-lg border border-gray-600
      ${isTopInput ? "pb-8" : "pt-8"}`}
    >
      <div className="flex justify-between mb-2">
        <span className="text-[#7f8596] font-medium">{label}</span>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5">
            <img
              src={`/${token.toLowerCase()}.png`}
              alt={token}
              className="w-full h-full"
            />
          </div>
          <span className="text-white font-medium">{token}</span>
        </div>
      </div>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full bg-transparent text-3xl text-white outline-none font-medium
            placeholder:text-white/20 appearance-none [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="0"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
          {token === "USDC" && (
            <button
              className="text-xs text-[#7f8596] font-medium bg-[#2d2f3a] px-2 py-1 rounded-md 
                hover:bg-[#3d3f4a] hover:text-white transition-all opacity-75 hover:opacity-100"
              onClick={onMint}
            >
              MINT
            </button>
          )}
          <button
            className="text-xs text-[#7f8596] font-medium bg-[#2d2f3a] px-2 py-1 rounded-md 
              hover:bg-[#3d3f4a] hover:text-white transition-all opacity-75 hover:opacity-100"
            onClick={handleMaxClick}
            disabled={!maxBalance}
          >
            MAX
          </button>
        </div>
      </div>
      <div className="text-[#7f8596] text-sm mt-1">{usdValue}</div>
    </div>
  );
};

export default function SwapInterface() {
  const [isSelling, setIsSelling] = useState(true);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const { address } = useAccount();
  const tuahContract = useContract({ address: CONTRACT_ADDRESS, abi: ABI });
  const usdcContract = useContract({ address: USDC_ADDRESS, abi: ABI });

  const { data: balanceData } = useReadContract({
    functionName: "balance_of",
    args: [address],
    address: CONTRACT_ADDRESS,
    abi: ABI,
    watch: true,
  });

  const { data: decimalsData } = useReadContract({
    functionName: "decimals",
    args: [],
    address: CONTRACT_ADDRESS,
    abi: ABI,
  });

  const { data: allowanceData } = useReadContract({
    functionName: "allowance",
    args: [address, CONTRACT_ADDRESS],
    address: USDC_ADDRESS,
    abi: ABI,
  });

  const { send: sendMintUSDC, error: errorMintUSDC } = useSendTransaction({
    calls:
      usdcContract?.contract && address
        ? [usdcContract.contract.populate("mint", [100n * 10n ** 18n])]
        : undefined,
  });

  console.log(allowanceData);

  const { send: sendMintTuah, error: errorMintTuah } = useSendTransaction({
    calls:
      tuahContract?.contract && address
        ? [tuahContract.contract.populate("mint", [amount])]
        : undefined,
  });

  useEffect(() => {
    if (balanceData && decimalsData) {
      const decimals = Number(decimalsData.decimals);
      const balanceValue = (
        Number(balanceData.balance.toString()) / Math.pow(10, decimals)
      ).toString();
      setBalance(balanceValue);
    }
  }, [balanceData, decimalsData]);

  const handleSwap = () => {
    setIsSelling(!isSelling);
  };

  const handleSwapAction = async () => {
    if (!isSelling && amount) {
      sendMintTuah();
    }
  };

  const handleMintUSDC = () => {
    sendMintUSDC();
  };

  return (
    <>
      <h1 className="text-3xl mx-auto mt-8 text-center font-semibold">
        Freakify your cryptocurrencies,
      </h1>
      <h1 className="text-3xl mx-auto mb-6 text-center font-semibold">
        start today.
      </h1>
      <div className="max-w-md mx-auto bg-[#212229] rounded-xl p-4 border border-[#2d2f3a]">
        <div className="relative">
          <div className="space-y-1">
            <TokenInput
              value={amount}
              onChange={setAmount}
              token={isSelling ? "USDTuah" : "USDC"}
              label={isSelling ? "Buy" : "Sell"}
              isTopInput={true}
              maxBalance={isSelling ? balance : undefined}
              onMint={handleMintUSDC}
            />
            <TokenInput
              value={amount}
              onChange={setAmount}
              token={isSelling ? "USDC" : "USDTuah"}
              label={isSelling ? "Sell" : "Buy"}
              maxBalance={!isSelling ? balance : undefined}
              onMint={handleMintUSDC}
            />
          </div>

          {/* Overlapping swap button */}
          <button
            onClick={handleSwap}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="bg-[#2d2f3a] p-3 rounded-lg hover:bg-[#3d3f4a] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#7f8596]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
          </button>
        </div>

        <button
          onClick={handleSwapAction}
          className="w-full mt-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium 
        py-3 px-4 rounded-lg transition-colors"
        >
          Swap
        </button>
      </div>
    </>
  );
}
