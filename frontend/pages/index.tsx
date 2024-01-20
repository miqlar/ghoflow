import React, { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

const Home = () => {
  const [sf, setSf] = useState(null);

  useEffect(() => {
    const initSuperfluid = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const sfInstance = await Framework.create({
        chainId: 11155111, //sepolia
        provider
      });
      setSf(sfInstance);
    };

    initSuperfluid();
  }, []);

  const createFlow = async (provider) => {
    if (!sf || !provider) return;

    const xGhoTokenAddress = '0x...'; // Replace with xGHO token address on Sepolia
    const signer = provider.getSigner();
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
      <button onClick={() => createFlow(new ethers.providers.Web3Provider(window.ethereum))}>Create Flow</button>
      {/* Other UI elements */}
    </div>
  );
};

export default Home;
