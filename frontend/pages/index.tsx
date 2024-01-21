import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box, VStack, Text, Select, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, Button
} from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import contractABI from './api/abi';
import GhoFlowFactoryComponent from './components/GhoFlowFactoryComponent';
import { ethers } from 'ethers';
import ConnectedWallet from './components/ ConnectedWallet'; //

const GhoFlowFactoryAddress = "0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8";

// Define the subscription rates
const subscriptionRates = {
  basic: 100,
  standard: 200,
  premium: 300,
} as const;

// Infer subscription types from subscriptionRates keys
type SubscriptionType = keyof typeof subscriptionRates;

const Home = () => {
  const { address, isConnecting, isConnected } = useAccount();
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionType>('basic');
  const [collateralization, setCollateralization] = useState(1.0);
  const [ethPriceUSD, setEthPriceUSD] = useState(0);
  const [requiredEth, setRequiredEth] = useState('0');
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);

  // Fetch ETH to USD price
  const { data: ethValueData } = useContractRead({
    address: GhoFlowFactoryAddress,
    abi: contractABI.abi,
    functionName: 'getETHValueDollars',
  });

  useEffect(() => {
    if (ethValueData) {
      const ethPrice = parseFloat(ethers.utils.formatUnits(ethValueData, 'wei'));
      setEthPriceUSD(ethPrice);

      const monthlyPriceUSD = subscriptionRates[selectedSubscription];
      const totalSubscriptionCostUSD = monthlyPriceUSD * subscriptionMonths;
      const requiredEthAmount = totalSubscriptionCostUSD / ethPrice;
      setRequiredEth(requiredEthAmount.toFixed(4));
    }
  }, [ethValueData, selectedSubscription, subscriptionMonths]);

  const handleSubscriptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubscription(e.target.value as SubscriptionType);
  };

  const handleCollateralChange = (value: number) => {
    setCollateralization(value);
  };

  const handleConnectWalletClick = () => {
    // Handle wallet connection here if needed
    // You can use a wallet provider like WalletConnect
    // and dispatch appropriate actions to connect the wallet.
  };

  return (
    <Box p={4}>
      <ConnectedWallet /> {/* Display the ConnectedWallet component */}
      {isConnected ? (
        <VStack spacing={4}>
          <Select placeholder="Select subscription" value={selectedSubscription} onChange={handleSubscriptionChange}>
            {Object.keys(subscriptionRates).map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)} - ${subscriptionRates[key as SubscriptionType]}/Month
              </option>
            ))}
          </Select>
          <Slider defaultValue={collateralization} min={1} max={2} step={0.01} onChange={(val) => handleCollateralChange(val)}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <GhoFlowFactoryComponent
            ethPriceUSD={ethPriceUSD}
            selectedSubscription={selectedSubscription}
            collateralization={collateralization}
            subscriptionRatePerMonth={subscriptionRates[selectedSubscription]}
            requiredEth={requiredEth}
          />
        </VStack>
      ) : (
        <Button onClick={handleConnectWalletClick}>Connect Wallet</Button>
      )}
    </Box>
  );
};

export default Home;