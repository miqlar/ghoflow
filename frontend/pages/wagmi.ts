// // wagmiConfig.ts
// import { configureChains, createClient } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { publicProvider } from 'wagmi/providers/public';
// import { InjectedConnector, WalletConnectConnector } from 'wagmi/connectors';

// const sepoliaChain = {
//   id: 11155111, // Sepolia chain ID
//   name: 'Sepolia',
//   network: 'sepolia',
//   nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
//   rpcUrls: {
//     default: 'https://sepolia.infura.io/v3/' + process.env.NEXT_PUBLIC_INFURA_ID,
//   },
//   blockExplorers: {
//     default: { name: 'Sepolia', url: 'https://sepolia.etherscan.io' },
//   },
//   testnet: true,
// };

// const { provider, webSocketProvider } = configureChains([sepoliaChain], [
//   alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
//   publicProvider(),
// ]);

// const connectors = () => [
//   new InjectedConnector({ chains: [sepoliaChain] }),
//   new WalletConnectConnector({
//     chains: [sepoliaChain],
//     options: {
//       projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
//       rpc: { 11155111: sepoliaChain.rpcUrls.default },
//     },
//   }),
// ];

// export const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
//   webSocketProvider,
// });

// export default wagmiClient;
