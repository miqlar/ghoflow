"use client";
import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount, useContract, useSigner } from 'wagmi';
import contractABI from '../api/abi.json';

const GhoFlowFactoryAddress = '0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8';

const GhoFlowFactoryComponent = () => {
  const { address: userAddress } = useAccount();
  const { data: signer } = useSigner();
  const [ghoAmount, setGhoAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState(userAddress || ''); // Default to user's address
  const [collateralization, setCollateralization] = useState(1); // Default to 100%
  const [paymentToken, setPaymentToken] = useState('ETH'); // Default to ETH

  // Initialize contract
  const contract = useContract({
    addressOrName: GhoFlowFactoryAddress,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });

  const handleCreateStream = useCallback(async () => {
    if (!signer) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const transaction = await contract.newStream(
        ethers.utils.parseEther(ghoAmount), // Convert GHO amount to wei
        beneficiary,
        {
          value: ethers.utils.parseEther(String(Number(ghoAmount) * collateralization)), // Calculate ETH amount based on collateralization
        }
      );
      await transaction.wait();
      alert('Stream created successfully');
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Failed to create stream');
    }
  }, [signer, ghoAmount, beneficiary, collateralization, contract]);

  return (
    <div>
      <div>
        <label>Product Netflix Subscription: 100$/Month</label>
        <input
          type="number"
          value={ghoAmount}
          onChange={(e) => setGhoAmount(e.target.value)}
          placeholder="GHO Amount"
        />
        <input
          type="range"
          min="1"
          max="2"
          step="0.01"
          value={collateralization}
          onChange={(e) => setCollateralization(Number(e.target.value))}
        />
        <select value={paymentToken} onChange={(e) => setPaymentToken(e.target.value)}>
          <option value="ETH">ETH</option>
          <option value="DAI">DAI</option>
          <option value="AAVE">AAVE</option>
        </select>
      </div>
      <div>
        <label>Beneficiary Address:</label>
        <input
          type="text"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          placeholder="Beneficiary Address"
        />
      </div>
      <button onClick={handleCreateStream}>Create Stream</button>
    </div>
  );
};

export default GhoFlowFactoryComponent;