import { useState } from 'react';
import { connect, disconnect } from "starknetkit";
import { Provider } from "starknet";

function App() {
  const [connection, setConnection] = useState<any>();
  const [provider, setProvider] = useState<Provider>();
  const [address, setAddress] = useState("");

  // connect wallet function
  const connectWallet = async () => {
    try {
      const result = await connect();
      
      if (result && result.wallet) {
        setConnection(result);
        setProvider(result.wallet.provider);
        setAddress(result.wallet.selectedAddress);
        console.log("Wallet connected!");
        console.log("Address:", result.wallet.selectedAddress);
      } else {
        console.log("User rejected wallet connection");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // disconnect wallet function
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setConnection(undefined);
      setProvider(undefined);
      setAddress("");
      console.log("Wallet disconnected!");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {!connection?.wallet ? (
        <button 
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <h3>Wallet Connected!</h3>
          <p>Address: {address}</p>
          <button 
            onClick={disconnectWallet}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
