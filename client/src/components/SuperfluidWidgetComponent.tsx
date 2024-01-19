"use client";
import React from 'react';
import SuperfluidWidget from '@superfluid-finance/widget';
import { useAccount } from 'wagmi';
import superTokenList from '@superfluid-finance/tokenlist';
const SuperfluidWidgetComponent = () => {
    const { isConnected } = useAccount();
  
    // Placeholder configuration
    const widgetConfig = {/*  widget config */};
  
    const walletManager = {
      open: () => { /*   */ },
      isOpen: () => { /* */ },
    };
  
    return (
      isConnected && (
        <SuperfluidWidget
          {...widgetConfig}
          tokenList={superTokenList}
          type="dialog"
          walletManager={walletManager}
        >
          {({ openModal }) => <button onClick={openModal}>Open Superfluid Widget</button>}
        </SuperfluidWidget>
      )
    );
  };