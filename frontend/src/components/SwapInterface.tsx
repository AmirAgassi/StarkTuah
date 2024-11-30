import { useState } from "react";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  token: string;
  label: string;
  isTopInput?: boolean;
}

const TokenInput = ({ value, onChange, token, label, isTopInput = false }: TokenInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // only allow non-negative numbers
    if (newValue === '' || (!isNaN(Number(newValue)) && Number(newValue) >= 0)) {
      onChange(newValue);
    }
  };

  return (
    <div className={`bg-[#1a1b23] p-4 rounded-lg border border-[#2d2f3a]
      ${isTopInput ? 'pb-8' : 'pt-8'}`}>
      <div className="flex justify-between mb-2">
        <span className="text-[#7f8596] font-medium">{label}</span>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5">
            <img src={`/${token.toLowerCase()}.png`} alt={token} className="w-full h-full" />
          </div>
          <span className="text-white font-medium">{token}</span>
        </div>
      </div>
      <div className="relative group">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min="0"
          step="any"
          className="w-full bg-transparent text-3xl text-white outline-none font-medium
            placeholder:text-white/20 appearance-none [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="0"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-xs text-[#7f8596] font-medium bg-[#2d2f3a] px-2 py-1 rounded-md hover:bg-[#3d3f4a]">
            MAX
          </button>
        </div>
      </div>
      <div className="text-[#7f8596] text-sm mt-1">≈ $0.00</div>
    </div>
  );
};

export default function SwapInterface() {
  const [isSelling, setIsSelling] = useState(true);
  const [amount, setAmount] = useState("");

  const handleSwap = () => {
    setIsSelling(!isSelling);
  };

  return (
    <div className="max-w-md mx-auto bg-[#212229] rounded-xl p-4 border border-[#2d2f3a]">
      <div className="relative">
        <div className="space-y-1">
          <TokenInput
            value={amount}
            onChange={setAmount}
            token={isSelling ? "USDTuah" : "USDC"}
            label={isSelling ? "Sell" : "Buy"}
            isTopInput={true}
          />
          <TokenInput
            value={amount}
            onChange={setAmount}
            token={isSelling ? "USDC" : "USDTuah"}
            label={isSelling ? "Buy" : "Sell"}
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

      <button className="w-full mt-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium 
        py-3 px-4 rounded-lg transition-colors">
        Swap
      </button>
    </div>
  );
} 