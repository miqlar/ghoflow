import React, { useState, ChangeEvent } from 'react';
import {
  Box, VStack, Text, Select, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, Button, useDisclosure
} from '@chakra-ui/react';
import { useAccount, useContractRead } from 'wagmi';
import contractABI from './api/abi';
import GhoFlowFactoryComponent from './components/GhoFlowFactoryComponent';
import { ConnectKitButton } from 'connectkit';

const GhoFlowFactoryAddress = "0x31554a01faEdDFDe645D6BDd8f810CBF1D180fA8";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const [selectedSubscription, setSelectedSubscription] = useState('basic');
  const [collateralization, setCollateralization] = useState(1.0);

  // Fetch ETH to USD price
  const { data: ethValueData } = useContractRead({
    address: GhoFlowFactoryAddress,
    abi: contractABI.abi,
    functionName: 'getETHValueDollars',
  });

// Get the ETH value in USD
const ethValueInDollars = ethValueData ? parseFloat(ethValueData.toString()) : 0;

// Subscription rates in USD
const subscriptionRates = {
  basic: 100,
  standard: 200,
  premium: 300,
};

// Function to handle subscription change
const handleSubscriptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
  setSelectedSubscription(e.target.value);
};

// Function to handle collateral change
const handleCollateralChange = (value: number) => {
  setCollateralization(value);
};

// Calculate the required ETH for the subscription
const subscriptionRatePerMonth = subscriptionRates[selectedSubscription as keyof typeof subscriptionRates];
const requiredEth = ethValueInDollars ? (subscriptionRatePerMonth / ethValueInDollars).toFixed(4) : '0';

return (
  <Box p={4}>
    <ConnectKitButton/>
    {isConnected ? (
      <VStack spacing={4}>
        <Select placeholder="Select subscription" value={selectedSubscription} onChange={handleSubscriptionChange}>
          <option value="basic">Basic - $100/Month</option>
          <option value="standard">Standard - $200/Month</option>
          <option value="premium">Premium - $300/Month</option>
        </Select>
        <Slider defaultValue={collateralization} min={1} max={2} step={0.01} onChange={(val) => handleCollateralChange(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <GhoFlowFactoryComponent 
          ethPriceUSD={ethValueInDollars}
          selectedSubscription={selectedSubscription} 
          collateralization={collateralization}
          subscriptionRatePerMonth={subscriptionRatePerMonth}
          requiredEth={requiredEth}
        />
      </VStack>
    ) : (
      <Text>Please connect your wallet.</Text>
    )}
  </Box>
);
};

export default Home;