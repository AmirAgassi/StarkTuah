import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { Connector, StarknetConfig, publicProvider } from "@starknet-react/core";

const chains = [mainnet, sepolia];
const connectors = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  new WebWalletConnector({ url: "https://web.argent.xyz" }),
  new ArgentMobileConnector(),
];
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors as Connector[]}
    >
    </StarknetConfig>
  </StrictMode>
);
