import { useAccount, useConnect } from "@starknet-react/core";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  return (
    <div>
      <div>Connect Wallet</div>

      {connectors.map((connector) => (
        <button onClick={() => connect({ connector })}>
          Connect {connector.id}
        </button>
      ))}
      

      <p>{address}</p>
    </div>
  );
}
