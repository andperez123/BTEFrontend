import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import './WalletButton.css';

const WalletButton = () => {
    console.log("WalletButton is rendering"); // Debug log

    return (
        <div style={{ 
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#fff"
        }}>
            <WalletMultiButton />
        </div>
    );
};

export default WalletButton; // Default export is correct