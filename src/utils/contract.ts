import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const burnAndMint = async (
    wallet: WalletContextState,
    _amount: number
): Promise<string> => {
    try {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // Create the transaction
        const transaction = new Transaction();

        // Sign and send the transaction
        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");

        return signature;
    } catch (error) {
        console.error("Transaction error:", error);
        throw error;
    }
};