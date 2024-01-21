// Home.tsx
import React, { useState } from 'react';
import { Box, Grid, GridItem, Text, VStack, Select } from '@chakra-ui/react';
import { ConnectKitButton } from 'connectkit';
import GhoFlowFactoryComponent from './components/GhoFlowFactoryComponent';

const Home = () => {
  const [selectedSubscription, setSelectedSubscription] = useState('basic');
  const [collateralRatio, setCollateralRatio] = useState(1);

  const subscriptionRates = {
    basic: 100,
    standard: 200,
    premium: 300,
  };

  const subscriptionRatePerMonth = subscriptionRates[selectedSubscription];

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <ConnectKitButton />
      <VStack spacing={4} align="center" justify="center">
        <Text fontSize="xl" fontWeight="bold">Subscription Plans</Text>
        <Select placeholder="Select subscription" value={selectedSubscription} onChange={(e) => setSelectedSubscription(e.target.value)}>
          <option value="basic">Basic - $100/Month</option>
          <option value="standard">Standard - $200/Month</option>
          <option value="premium">Premium - $300/Month</option>
        </Select>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem colSpan={3}>
            <GhoFlowFactoryComponent 
              selectedSubscription={selectedSubscription} 
              collateralRatio={collateralRatio}
              subscriptionRatePerMonth={subscriptionRatePerMonth}
            />
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Home;
