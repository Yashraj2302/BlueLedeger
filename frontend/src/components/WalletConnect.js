import React from 'react';
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import useWallet from '../hooks/useWallet';

const WalletConnect = () => {
  const {
    account,
    isConnected,
    isConnecting,
    error,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    formatAddress,
    isCorrectNetwork,
    isMetaMaskInstalled,
  } = useWallet();

  if (!isMetaMaskInstalled) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
        >
          Install MetaMask
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="h-5 w-5" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Network Status */}
      <div className="flex items-center space-x-2">
        {isCorrectNetwork() ? (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Polygon</span>
          </div>
        ) : (
          <button
            onClick={switchToPolygon}
            className="flex items-center space-x-1 text-orange-600 hover:text-orange-700"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Switch to Polygon</span>
          </button>
        )}
      </div>

      {/* Account Info */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {formatAddress(account)}
        </span>
        <button
          onClick={disconnectWallet}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
