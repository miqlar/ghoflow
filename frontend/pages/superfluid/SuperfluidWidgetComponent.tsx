// import React from 'react';
// import SuperfluidWidget from '@superfluid-finance/widget';
// import superTokenList from "@superfluid-finance/tokenlist";
// import { useAccount } from "wagmi";

// const SuperfluidComponent = () => {
//   const { isConnected } = useAccount();
//   const widgetData = {/* ... your widget configuration ... */};

//   if (!isConnected) {
//     return <p>Please connect your wallet to use the Superfluid Widget.</p>;
//   }

//   return (
//     <div>
//     <WagmiConfig config={wagmiConfig}></WagmiConfig>
//       <SuperfluidWidget
//         {...widgetData}
//         tokenList={superTokenList}
//         type="dialog"
//         // Define your walletManager logic based on ConnectKit
//         walletManager={{
//           open: () => {/* logic to open wallet */},
//           isOpen: isConnected,
//         }}
//       >
//         {({ openModal }) => (
//           <button onClick={() => openModal()}>Subscribe Now</button>
//         )}
//       </SuperfluidWidget>
//     </WagmiConfig>
//     </div>
//   );
// };

// export default SuperfluidComponent;
