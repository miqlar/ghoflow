"use client";
import { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import '../styles/globals.css';

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.ALCHEMY_ID, // Replace with your Alchemy ID
    walletConnectProjectId: "3f296b8d0eb4eb510d067de47f8ab560", // Replace with your WalletConnect Project ID
    appName: 'Your App Name',
    // ...other config
  }),
);

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </WagmiConfig>
    );
  }
export default MyApp;
