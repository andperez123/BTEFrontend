import { Connection, Transaction, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { createBurnInstruction } from "@solana/spl-token";

export const burnAndMint = async (
    wallet: WalletContextState,
    amount: number,
    mintAddress: string,
    tokenAccountAddress: string,
    decimals: number
): Promise<string> => {
    try {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const burnAmount = amount * Math.pow(10, decimals);

        // Create burn instruction
        const burnInstruction = createBurnInstruction(
            new PublicKey(tokenAccountAddress), // token account
            new PublicKey(mintAddress), // mint
            wallet.publicKey, // owner
            burnAmount
        );

        // Create transaction and add burn instruction
        const transaction = new Transaction().add(burnInstruction);
        
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        // Sign and send the transaction
        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");

        return signature;
    } catch (error) {
        console.error("Transaction error:", error);
        throw error;
    }
};