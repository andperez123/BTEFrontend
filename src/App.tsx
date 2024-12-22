import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import WalletButton from "./components/WalletButton";
import BurnInterface from "./components/BurnInterface";

import "@solana/wallet-adapter-react-ui/styles.css";
import './App.css';

const App = () => {
  console.log("App is rendering"); // Debug log

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="main-container">
            <div className="wallet-wrapper">
              <WalletButton />
            </div>
            <div className="App">
              <h1>Burn To Earn</h1>
              <BurnInterface />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
