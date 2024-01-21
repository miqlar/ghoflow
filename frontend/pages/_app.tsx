import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import ConnectedWallet from './components/ ConnectedWallet';

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

// Include Sepolia in the list of supported chains
const chains = [ sepolia];

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
      <ConnectKitProvider theme="auto" mode="auto">
        <ConnectedWallet />
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;