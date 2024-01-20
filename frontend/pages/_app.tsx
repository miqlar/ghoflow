import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import SuperfluidWidget, { EventListeners, PaymentOption } from '@superfluid-finance/widget';
import { useCallback, useMemo, useState } from 'react';

import productDetails from './superfluid/productDetails';
import paymentDetails from './superfluid/paymentDetails';
import superfluidWidgetConfig from './superfluid/superfluid_widget.json';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  const [initialChainId, setInitialChainId] = useState<number | undefined>();
  const onPaymentOptionUpdate = useCallback<Required<EventListeners>['onPaymentOptionUpdate']>(
    (paymentOption?: PaymentOption) => setInitialChainId(paymentOption?.chainId),
    [setInitialChainId]
  );

  const eventListeners = useMemo<EventListeners>(
    () => ({ onPaymentOptionUpdate }),
    [onPaymentOptionUpdate]
  );

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <SuperfluidWidget
          productDetails={productDetails}
          paymentDetails={paymentDetails}
          walletManager={{
            open: () => { /* ConnectKit modal here */ },
            isOpen: false, // ConnectKit modal's open state
          }}
          eventListeners={eventListeners}
        >
          {({ openModal }) => (
            <button onClick={() => openModal()}>Open Superfluid Widget</button>
          )}
        </SuperfluidWidget>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;