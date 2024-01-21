import { useAccount } from 'wagmi';

const ConnectedWallet = () => {
  const { address, isConnecting, isConnected } = useAccount();

  if (isConnecting) return <div>Connecting...</div>;
  if (!isConnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

export default ConnectedWallet;