import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { burnAndMint } from "../utils/contract";
import './BurnInterface.css';

interface TokenAccount {
    mint: string;
    balance: string;
    decimals: number;
    tokenAccount: string;
    symbol?: string;
}

const BurnInterface = () => {
    const wallet = useWallet();
    const [tokens, setTokens] = useState<TokenAccount[]>([]);
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [burnAmount, setBurnAmount] = useState(0);
    const [txStatus, setTxStatus] = useState("");
    const [solBalance, setSolBalance] = useState<number>(0);

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const fetchBalances = async () => {
        if (!wallet.publicKey) {
            console.log("No wallet public key found");
            return;
        }
        
        try {
            const balance = await connection.getBalance(wallet.publicKey);
            setSolBalance(balance / 1e9);
            console.log("SOL Balance:", balance / 1e9);

            console.log("Fetching tokens for wallet:", wallet.publicKey.toString());
            const accounts = await connection.getParsedTokenAccountsByOwner(
                wallet.publicKey,
                { programId: TOKEN_PROGRAM_ID }
            );

            console.log("Raw accounts data:", accounts);

            const tokenAccounts = accounts.value.map((account) => {
                const parsedInfo = account.account.data.parsed.info;
                console.log("Parsed token info:", parsedInfo);
                return {
                    mint: parsedInfo.mint,
                    balance: parsedInfo.tokenAmount.amount,
                    decimals: parsedInfo.tokenAmount.decimals,
                    tokenAccount: account.pubkey.toBase58()
                };
            });

            console.log("Processed token accounts:", tokenAccounts);
            setTokens(tokenAccounts);
        } catch (error) {
            console.error("Error fetching tokens:", error);
            setTxStatus("Failed to fetch tokens");
        }
    };

    const handleBurn = async () => {
        if (!wallet.connected) {
            setTxStatus("Wallet not connected");
            return;
        }

        if (!selectedToken) {
            setTxStatus("Please select a token");
            return;
        }

        try {
            setTxStatus("Processing...");
            const selectedTokenAccount = tokens.find(t => t.mint === selectedToken);
            if (!selectedTokenAccount) {
                throw new Error("Selected token not found");
            }

            const tx = await burnAndMint(
                wallet, 
                burnAmount,
                selectedToken,
                selectedTokenAccount.tokenAccount,
                selectedTokenAccount.decimals
            );
            setTxStatus(`Transaction successful: ${tx}`);
            fetchBalances();
        } catch (error: any) {
            setTxStatus(`Transaction failed: ${error.message}`);
        }
    };

    useEffect(() => {
        if (wallet.connected) {
            fetchBalances();
        }
    }, [wallet.connected]);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Burn Tokens</h1>
            
            {solBalance > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <p>SOL Balance: {solBalance.toFixed(4)} SOL</p>
                </div>
            )}
            
            <select 
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                style={{ padding: "10px", margin: "10px", width: "300px" }}
            >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                    <option key={token.mint} value={token.mint}>
                        {`${token.mint.slice(0, 8)}... - Balance: ${token.balance}`}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Burn Amount"
                value={burnAmount}
                onChange={(e) => setBurnAmount(Number(e.target.value))}
                style={{ padding: "10px", margin: "10px" }}
            />
            
            <button
                onClick={handleBurn}
                disabled={!wallet.connected || !selectedToken || burnAmount <= 0}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    opacity: (!wallet.connected || !selectedToken || burnAmount <= 0) ? 0.5 : 1
                }}
            >
                Burn and Mint
            </button>
            
            {txStatus && (
                <p style={{ marginTop: "10px", color: txStatus.includes("failed") ? "red" : "green" }}>
                    {txStatus}
                </p>
            )}
        </div>
    );
};

export default BurnInterface;
