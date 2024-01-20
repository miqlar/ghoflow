// SuperfluidWidgetComponent.tsx
import React, { useMemo } from 'react';
import SuperfluidWidget from '@superfluid-finance/widget';
import superTokenList from "@superfluid-finance/tokenlist";
import { useAccount } from "wagmi";
import superfluidWidgetData from './superfluid_widget.json'; 


const SuperfluidWidgetComponent = ({ data }) => {
  const { isConnected } = useAccount();

  const walletManager = useMemo(() => ({
    open: () => { /* logic to handle wallet opening if needed */ },
    isOpen: isConnected,
  }), [isConnected]);

  return (
    <div>
      {isConnected && (
        <SuperfluidWidget
          {...data}
          tokenList={superTokenList}
          type="dialog" // or 'drawer', 'full-screen', etc.
          walletManager={walletManager}
        >
          {({ openModal }) => (
            <button onClick={openModal}>Open Superfluid Widget</button>
          )}
        </SuperfluidWidget>
      )}
    </div>
  );
};

export default SuperfluidWidgetComponent;
