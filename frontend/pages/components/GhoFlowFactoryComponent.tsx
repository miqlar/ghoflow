
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

const GhoFlowFactoryAddress = "0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8";

interface Props {
  collateralRatio: number;
}

const GhoFlowFactoryComponent = () => {
  const { address: userAddress } = useAccount();
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);
  const [collateralization, setCollateralization] = useState(1.0);

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

  const subscriptionRatePerMonth = 100; // Assuming a flat rate of $100 per month
  const totalEthAmount =
    (subscriptionRatePerMonth * subscriptionMonths) / (ethValueInDollars);
  const flowRate = 1; // Define the flow rate

  // Prepare the contract write operation
  const { config: ethStreamConfig, error: prepareError } =
    usePrepareContractWrite({
      address: GhoFlowFactoryAddress,
      abi: contractABI.abi,
      functionName: "ethToGhoStream",
      args: [
        BigInt(String(totalEthAmount)), // Total ETH for the subscription
        BigInt(flowRate), // The flow rate to stream GHO tokens
        userAddress as Address, // The beneficiary address
      ],
      enabled: userAddress !== undefined,
      value: BigInt(String(totalEthAmount * collateralization)), // Collateralization amount in ETH
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
        {isLoading ? "Creating Stream..." : "Create Stream"}
      </button>
      {writeError && <p>Error: {writeError.message}</p>}
    </div>
  );
};

export default GhoFlowFactoryComponent;