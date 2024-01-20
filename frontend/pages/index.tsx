import React, { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

const Home = () => {
  const [sf, setSf] = useState(null);

  useEffect(() => {
    const initSuperfluid = async () => {
      const alchemyProvider = new ethers.providers.AlchemyProvider(
        'sepolia', // Replace with your network
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY // Your Alchemy API key
      );

      const sfInstance = await Framework.create({
        chainId: 11155111, // Sepolia testnet chain ID
        provider: alchemyProvider
      });

      setSf(sfInstance);
    };

    initSuperfluid();
  }, []);

  const createFlow = async () => {
    if (!sf) return;

    const xGhoTokenAddress = '0x...'; // Replace with xGHO token address on Sepolia
    const signer = sf.provider.getSigner();
    const xGho = await sf.loadSuperToken(xGhoTokenAddress);

    const senderAddress = await signer.getAddress();
    const receiverAddress = '0xReceiverAddress'; // Replace with receiver address like "Netflix"
    const flowRate = '38580246913580'; // Example flow rate

    const createFlowOperation = xGho.createFlow({
      sender: senderAddress,
      receiver: receiverAddress,
      flowRate: flowRate
    });

    const txnResponse = await createFlowOperation.exec(signer);
    const txnReceipt = await txnResponse.wait();
    // Handle response
  };

  return (
    <div>
      <ConnectKitButton />
      <button onClick={createFlow}>Create Flow</button>
      {/* Other UI elements */}
    </div>
  );
};

export default Home;
