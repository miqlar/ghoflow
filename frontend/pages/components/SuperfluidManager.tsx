import React, { useState, useEffect } from 'react';
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { ConnectKitButton } from 'connectkit';

const SuperfluidManager = () => {
  const [sf, setSf] = useState(null);
  const [receiver, setReceiver] = useState('');
  const [flowRate, setFlowRate] = useState('');

  useEffect(() => {
    const initSuperfluid = async () => {
      const provider = new ethers.providers.AlchemyProvider(
        'sepolia', 
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      );
      const sfInstance = await Framework.create({
        chainId: 11155111, 
        provider
      });
      setSf(sfInstance);
    };

    initSuperfluid();
  }, []);

  const handleCreateFlow = async () => {
    if (!sf) return;

    const xGhoTokenAddress = '0x...'; // xGHO token address
    const signer = sf.provider.getSigner();
    const xGho = await sf.loadSuperToken(xGhoTokenAddress);

    const createFlowOperation = xGho.createFlow({
      sender: await signer.getAddress(),
      receiver,
      flowRate
    });

    try {
      const txnResponse = await createFlowOperation.exec(signer);
      await txnResponse.wait();
      alert('Flow created successfully');
    } catch (error) {
      console.error('Error creating flow:', error);
    }
  };

  return (
    <div>
      <ConnectKitButton />
      <input type="text" value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="Receiver Address" />
      <input type="text" value={flowRate} onChange={e => setFlowRate(e.target.value)} placeholder="Flow Rate" />
      <button onClick={handleCreateFlow}>Create Flow</button>
    </div>
  );
};

export default SuperfluidManager;
