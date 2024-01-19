"use client";

import React from 'react';
import ConnectButton from '../components/ConnectButton'; // Ensure this component exists
import SuperfluidWidgetComponent from '../components/SuperfluidWidgetComponent'; // Ensure this component exists

const Page = () => {
  return (
    <main>
      <h1>GhoFlow</h1>
      <ConnectButton />
      <SuperfluidWidgetComponent />
      {/* dashboard etc */}
    </main>
  );
};

export default Page;
