import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import ConnectedWallet from './components/ ConnectedWallet';
// import { useCallback, useMemo, useState } from 'react';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {/* */}
        <ConnectedWallet />
        {/* */}
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;