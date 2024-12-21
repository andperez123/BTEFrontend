import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { burnAndMint } from "../utils/contract";
import './BurnToEarn.css';

const BurnInterface = () => {
    const wallet = useWallet();
    const [burnAmount, setBurnAmount] = useState(0);
    const [txStatus, setTxStatus] = useState("");

    const handleBurn = async () => {
        if (!wallet.connected) {
            setTxStatus("Wallet not connected");
            return;
        }

        try {
            setTxStatus("Processing...");
            const tx = await burnAndMint(wallet, burnAmount);
            setTxStatus(`Transaction successful: ${tx}`);
        } catch (error: any) {
            setTxStatus(`Transaction failed: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Burn Tokens</h1>
            <input
                type="number"
                placeholder="Burn Amount"
                value={burnAmount}
                onChange={(e) => setBurnAmount(Number(e.target.value))}
                style={{ padding: "10px", margin: "10px" }}
            />
            <button
                onClick={handleBurn}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                }}
            >
                Burn and Mint
            </button>
            {txStatus && <p>{txStatus}</p>}
        </div>
    );
};

export default BurnInterface;
