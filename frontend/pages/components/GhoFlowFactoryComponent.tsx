import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Address, useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import contractABI from '../api/abi'; // The ABI for your contract

const GhoFlowFactoryAddress = '0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8';

const GhoFlowFactoryComponent = () => {
  const { address: userAddress } = useAccount();
  const [subscriptionMonths, setSubscriptionMonths] = useState(5);
  const [collateralization, setCollateralization] = useState(1.0);
  const [ethValueInDollars, setEthValueInDollars] = useState(0); // This value should be fetched from your contract or an oracle
  const subscriptionRatePerMonth = 100; // Assuming a flat rate of $100 per month

  // Calculate the total ETH amount based on the current ETH value in dollars
  const totalEthAmount = (subscriptionRatePerMonth * subscriptionMonths) / ethValueInDollars;

  // Calculate the flowRate based on your logic, this is just a placeholder
  const flowRate = 1; // int96 value needed here

  // Prepare the contract write operation
  const { config: ethStreamConfig, error: prepareError } = usePrepareContractWrite({
    address: GhoFlowFactoryAddress,
    abi: contractABI.abi,
    functionName: 'ethToGhoStream',
    args: [
      BigInt(String(totalEthAmount)), // Total ETH for the subscription
      BigInt(flowRate), // The flow rate to stream GHO tokens
      userAddress as Address, // The beneficiary address
    ], enabled : userAddress != undefined,
      value: BigInt(String(totalEthAmount * collateralization)), // Collateralization amount in ETH
  });

  const { write: createEthStream, isLoading, error: writeError, data } = useContractWrite(ethStreamConfig);

  const handleCreateStream = async () => {
    if (!createEthStream) {
      alert('Please connect your wallet');
      return;
    }
    if (prepareError) {
      console.error('Error preparing transaction:', prepareError);
      return;
    }

    try {
      const transaction = createEthStream();
      alert('Stream created successfully');
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Failed to create stream');
    }
  };

  // Fetch ETH value in dollars from the contract or an oracle
  useEffect(() => {
    // This function should call your contract's getETHValueDollars() method
    // and update the state with the current value of ETH in dollars
    const fetchEthValueInDollars = async () => {
      // Assume we have a function `getEthValueInDollarsFromContract` that returns the value
      const value = await getEthValueInDollarsFromContract();
      setEthValueInDollars(value);
    };
    
    fetchEthValueInDollars();
  }, []);

  return (
    <div>
      {/* UI components for selecting subscription, setting collateralization, and amount */}
      <input
        type="number"
        value={subscriptionMonths}
        onChange={(e) => setSubscriptionMonths(Number(e.target.value))}
        placeholder="Months of subscription"
      />
      <input
        type="range"
        min="1"
        max="2"
        step="0.01"
        value={collateralization}
        onChange={(e) => setCollateralization(Number(e.target.value))}
      />
      <button onClick={handleCreateStream} disabled={isLoading}>
        {isLoading ? 'Creating Stream...' : 'Create Stream'}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
    </div>
  );
};

export default GhoFlowFactoryComponent;