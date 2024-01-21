import React, { useState } from 'react';
import { ConnectKitButton, useConnect } from 'connectkit';
import { Box, Grid, GridItem, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';
import GhoFlowFactoryComponent from './components/GhoFlowFactoryComponent';

const Home = () => {
  const [selectedSubscription, setSelectedSubscription] = useState('basic');
  const [collateralRatio, setCollateralRatio] = useState(1);
  const { isConnected } = useConnect();

  // Determine the subscription rate based on the selected option
  const getSubscriptionRate = (subscription) => {
    switch (subscription) {
      case 'basic':
        return 100;
      case 'standard':
        return 200;
      case 'premium':
        return 300;
      default:
        return 100;
    }
  };

  const subscriptionRatePerMonth = getSubscriptionRate(selectedSubscription);

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <ConnectKitButton />
      {isConnected && (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Text mb="8px">Subscription Selection</Text>
            <Select onChange={(e) => setSelectedSubscription(e.target.value)}>
              <option value="basic">Basic Plan - $100/Month</option>
              <option value="standard">Standard Plan - $200/Month</option>
              <option value="premium">Premium Plan - $300/Month</option>
            </Select>
          </GridItem>
          <GridItem>
            <Text mb="8px">Collateralization Ratio</Text>
            <Slider defaultValue={collateralRatio} min={1} max={2} step={0.01} onChange={(val) => setCollateralRatio(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </GridItem>
          <GridItem colSpan={2}>
            {/* GhoFlowFactory Component */}
            <GhoFlowFactoryComponent 
              selectedSubscription={selectedSubscription} 
              collateralRatio={collateralRatio}
              subscriptionRatePerMonth={subscriptionRatePerMonth}
            />
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default Home;
