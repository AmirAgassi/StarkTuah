import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { Connector, StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import App from "./App.tsx";

const chains = [mainnet, sepolia];
const connectors = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  new WebWalletConnector({ url: "https://web.argent.xyz" }),
  new ArgentMobileConnector(),
];

// Configure JSON-RPC provider with Alchemy endpoint
const rpc = (chain: Chain) => ({
  nodeUrl: `https://starknet-${chain.network}.g.alchemy.com/starknet/version/rpc/v0_7/cCmdllUM3oiBjOpStn0RrTb8eifa87te`
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetConfig
      chains={chains}
      provider={jsonRpcProvider({ rpc })}
      connectors={connectors as Connector[]}
    >
      <App />
    </StarknetConfig>
  </StrictMode>
);
