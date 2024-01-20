// // wagmiConfig.ts
// import { WagmiConfig, createConfig } from 'wagmi';
// import { publicProvider } from 'wagmi/providers/public';
// import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
// import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';


// const walletConnectProjectId = "952483bf7a0f5ace4c40eb53967f1368";


// const wagmiClient = createConfig({
//   autoConnect: true,
//   connectors: getDefaultConfig({
//     appName: 'Your App Name',
//     alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
//     chains: [mainnet, polygon, optimism, arbitrum, sepolia],
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
//   }).connectors,
//   provider,
// });

// export { wagmiClient, ConnectKitProvider };
