// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { useAccount, useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
// import contractABI from '../api/abi';

// const GhoFlowFactoryAddress = '0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8';

// const GhoFlowFactoryComponent = ({ selectedSubscription, collateralRatio, subscriptionRatePerMonth }) => {    const { address: userAddress } = useAccount();
//     const [subscriptionMonths, setSubscriptionMonths] = useState(1);
//     const [collateralization, setCollateralization] = useState(1.0);
//     const [subscriptionPlan, setSubscriptionPlan] = useState('basic');
//     const [ethPriceUSD, setEthPriceUSD] = useState(0);

//     // Subscription rates in USD per month
//     type SubscriptionPlan = 'basic' | 'standard' | 'premium';

//     const subscriptionRates: Record<SubscriptionPlan, number> = {
//         basic: 100,
//         standard: 200,
//         premium: 300,
//     };

//     // Fetch ETH to USD price
//     const { data: ethValueData, isError, isLoading: isEthValueLoading } = useContractRead({
//         address: GhoFlowFactoryAddress,
//         abi: contractABI.abi,
//         functionName: 'getETHValueDollars',
//     });

//     useEffect(() => {
//         if (ethValueData) {
//             const ethPrice = parseFloat(ethers.utils.formatUnits(ethValueData, 'wei'));
//             setEthPriceUSD(ethPrice);
//         }
//     }, [ethValueData]);

//     const subscriptionRatePerMonthUSD = subscriptionRates[subscriptionPlan];
//     const dailyRateUSD = subscriptionRatePerMonthUSD / 30; // daily subscription rate
//     const subscriptionDurationDays = subscriptionMonths * 30; // total subscription duration in days
//     const totalSubscriptionCostUSD = dailyRateUSD * subscriptionDurationDays; // total cost for the subscription period
//     const totalEthRequired = ethPriceUSD > 0 ? (totalSubscriptionCostUSD / ethPriceUSD) * collateralization : 0;

//     // Calculate flow rate in GHO per second based on the daily rate
//     const flowRatePerDay = dailyRateUSD / ethPriceUSD; // daily flow rate in ETH
//     const flowRatePerSecond = ethers.utils.parseUnits((flowRatePerDay / (24 * 60 * 60)).toString(), 'ether'); // convert to ETH per second

//     // Prepare the contract write operation for creating an ETH stream
//     const { config: ethStreamConfig, error: prepareError } = usePrepareContractWrite({
//         address: GhoFlowFactoryAddress,
//         abi: contractABI.abi,
//         functionName: 'ethToGhoStream',
//         args: [
//             BigInt(totalEthRequired.toString(), 'ether'),
//             BigInt(flowRatePerSecond), // flow rate in GHO per second
//             userAddress as Address,
//         ],
//         enabled: userAddress != undefined,
//         value: ethers.utils.parseUnits(totalEthRequired.toString(), 'ether'), // The total ETH value to send
//     });

//     const { write: createEthStream, isLoading, error: writeError } = useContractWrite(ethStreamConfig);

//     const handleCreateStream = async () => {
//         if (!createEthStream) {
//             alert('Please connect your wallet');
//             return;
//         }
//         if (prepareError) {
//             console.error('Error preparing transaction:', prepareError);
//             return;
//         }

//         try {
//             await createEthStream();
//             alert('Stream created successfully');
//         } catch (error) {
//             console.error('Error creating stream:', error);
//             alert('Failed to create stream');
//         }
//     };

//     return (
//         <div>
//             <select value={subscriptionPlan} onChange={(e) => setSubscriptionPlan(e.target.value)}>
//                 <option value="basic">Basic - $100/Month</option>
//                 <option value="standard">Standard - $200/Month</option>
//                 <option value="premium">Premium - $300/Month</option>
//             </select>
//             <input
//                 type="number"
//                 value={subscriptionMonths}
//                 onChange={(e) => setSubscriptionMonths(Number(e.target.value))}
//                 placeholder="Months of subscription"
//             />
//             <input
//                 type="range"
//                 min="1"
//                 max="2"
//                 step="0.01"
//                 value={collateralization}
//                 onChange={(e) => setCollateralization(Number(e.target.value))}
//             />
//             <button onClick={handleCreateStream} disabled={isLoading || isEthValueLoading}>
//                 {isLoading ? 'Creating Stream...' : 'Create Stream'}
//             </button>
//             {writeError && <p>Error: {writeError.message}</p>}
//         </div>
//     );
// };

// export default GhoFlowFactoryComponent;