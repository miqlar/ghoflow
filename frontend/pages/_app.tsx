'use client';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig, ConnectKitButton } from 'connectkit';
import React, { useEffect, useState } from 'react';
import ConnectedWallet from './components/ ConnectedWallet';

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const chains = [sepolia];

const config = createConfig(
  getDefaultConfig({
    appName: 'GhoFlow Demo',
    alchemyId,
    walletConnectProjectId,
    chains,
  }),
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
<WagmiConfig config={config}>
      <ConnectKitProvider>
        <Component {...pageProps} />
        <ConnectKitButton />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;