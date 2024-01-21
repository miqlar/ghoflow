// 'use client';
// import { WagmiConfig, createConfig } from "wagmi";
// import { ConnectKitProvider, getDefaultConfig } from "connectkit";
// import React, { ReactNode } from 'react';


// const config = createConfig(
//   getDefaultConfig({
//     alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    
//     appName: "GhoFlow",
//     appDescription: "GhoFlow",
//     appUrl: "https://family.co",
//     appIcon: "https://family.co/logo.png",
//   }),
// );

// export const ConnectkitProvider =({ children}) => {
//     return (
//     <WagmiConfig config={config}>
//      <ConnectKitProvider>
//         {children}
//      </ConnectKitProvider>
// </WagmiConfig>
//     );
// };