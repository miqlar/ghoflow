"use client";

import { useState } from "react";
import { formatEther } from "viem";
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import contractABI from "../api/abi";
import { ethers } from 'ethers';
 

const GhoFlowFactoryAddress = "0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8";


interface Props {
    ethPriceUSD: number;
    selectedSubscription: string;
    collateralization: number;
    subscriptionRatePerMonth: number;
    requiredEth: string;
  }
  
  const GhoFlowFactoryComponent: React.FC<Props> = ({
    ethPriceUSD,
    selectedSubscription,
    collateralization,
    subscriptionRatePerMonth,
    requiredEth,
  }) => {
    const { address: userAddress } = useAccount();
    const flowRate = 1;

  // Using useContractRead to get the ETH value in dollars
  const {
    data: ethValueData,
    isError: isEthValueError,
    isLoading: isEthValueLoading,
  } = useContractRead({
    address: GhoFlowFactoryAddress,
    abi: contractABI.abi,
    functionName: "getETHValueDollars",
  });

  const ethValueInDollars = ethValueData
    ? parseFloat(formatEther(ethValueData, "wei"))
    : 1;

// Prepare the contract write operation
const { config: ethStreamConfig, error: prepareError } =
  usePrepareContractWrite({
    address: GhoFlowFactoryAddress,
    abi: contractABI.abi,
    functionName: "ethToGhoStream",
    args: [
      BigInt(ethers.utils.parseUnits(requiredEth, 'ether').toString()), // Total ETH for the subscription
      BigInt(flowRate), // The flow rate to stream GHO tokens
      userAddress as Address, // The beneficiary address
    ],
    enabled: userAddress !== undefined,
    value: BigInt(ethers.utils.parseUnits((Number(requiredEth) * collateralization).toString(), 'ether').toString()),
  });

  const {
    writeAsync: createEthStream,
    isLoading,
    error: writeError,
    data,
  } = useContractWrite(ethStreamConfig);

  const handleCreateStream = async () => {
    if (!createEthStream) {
      alert("Please connect your wallet");
      return;
    }
    if (prepareError) {
      console.error("Error preparing transaction:", prepareError);
      return;
    }

    try {
      await createEthStream();
      alert("Stream created successfully");
    } catch (error) {
      console.error("Error creating stream:", error);
      alert("Failed to create stream");
    }
  };

  
  return (
    <div>
      <button onClick={handleCreateStream} disabled={isLoading}>
        {isLoading ? "Creating Stream..." : "Create Stream"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
    </div>
  );
};

export default GhoFlowFactoryComponent;