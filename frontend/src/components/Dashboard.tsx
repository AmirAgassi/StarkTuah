import React, { useState } from 'react';
import SwapInterface from './SwapInterface';
import ContractInfo from './ContractInfo';
import { useContract, useSendTransaction } from "@starknet-react/core";

// import contract abi and address
import { CONTRACT_ADDRESS, USDC_ADDRESS } from '../constants';
import TuahAbiJson from '../abi/tuah_abi.json';

type TabType = 'swap' | 'audit';

// extract the abi from the json structure
const TuahAbi = TuahAbiJson.abi;

const EKUBO_POOL = "0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f";
const AMOUNT = "100000000000000000000"; // 100 USDC
const MIN_AMOUNT = "90000000000000000000"; // 90 ETH

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('swap');
  
  // initialize contracts
  const { contract: tuahContract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: TuahAbi,
  });

  const { contract: usdcContract } = useContract({
    address: USDC_ADDRESS,
    abi: TuahAbi, // using same ABI since both are ERC20
  });
  
  // approve transaction
  const { send: sendApprove } = useSendTransaction({
    calls: usdcContract ? [{
      contractAddress: USDC_ADDRESS,
      entrypoint: "approve",
      calldata: [EKUBO_POOL, AMOUNT]
    }] : undefined,
  });

  // swap transaction
  const { send: sendSwapEth } = useSendTransaction({
    calls: tuahContract ? [{
      contractAddress: CONTRACT_ADDRESS,
      entrypoint: "swap_usdc_for_eth",
      calldata: [EKUBO_POOL, AMOUNT, MIN_AMOUNT]
    }] : undefined,
  });

  const handleTestSwap = async () => {
    try {
      console.log("Approving USDC...");
      await sendApprove();
      
      console.log("Executing swap...");
      await sendSwapEth();
      
      console.log("Swap transaction completed successfully");
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-6">
      <div className="container mx-auto px-6 pt-16">
        {/* test swap button */}
        <button
          onClick={handleTestSwap}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Test ETH Swap
        </button>
        
        {/* existing dashboard content */}
        <div className="flex min-h-[calc(100vh)]" style={{
          background: 'radial-gradient(circle at bottom, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0))',
        }}>
          <div className="flex-1 pl-8">
            <ContractInfo />
            {activeTab === 'swap' && (
              <div>
                <SwapInterface />
              </div>
            )}
            {activeTab === 'audit' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400">Audit section coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;