import { useState, useEffect, useCallback } from 'react';

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Get current account
  const getCurrentAccount = useCallback(async () => {
    if (!isMetaMaskInstalled()) return null;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    } catch (error) {
      console.error('Error getting current account:', error);
      return null;
    }
  }, []);

  // Get current chain ID
  const getCurrentChainId = useCallback(async () => {
    if (!isMetaMaskInstalled()) return null;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        const chainId = await getCurrentChainId();
        
        setAccount(account);
        setChainId(chainId);
        setIsConnected(true);
        
        // Store connection state in localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAccount', account);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAccount');
  };

  // Switch to Polygon network
  const switchToPolygon = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon mainnet
      });
    } catch (error) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com'],
            }],
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
          setError('Failed to add Polygon network');
        }
      } else {
        console.error('Error switching to Polygon:', error);
        setError('Failed to switch to Polygon network');
      }
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if connected to correct network
  const isCorrectNetwork = () => {
    return chainId === 137; // Polygon mainnet
  };

  // Initialize wallet connection on component mount
  useEffect(() => {
    const initializeWallet = async () => {
      if (isMetaMaskInstalled()) {
        const account = await getCurrentAccount();
        const chainId = await getCurrentChainId();
        
        if (account) {
          setAccount(account);
          setChainId(chainId);
          setIsConnected(true);
        }
      }
    };

    initializeWallet();

    // Listen for account changes
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          disconnectWallet();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    // Cleanup listeners
    return () => {
      if (isMetaMaskInstalled()) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [getCurrentAccount, getCurrentChainId]);

  return {
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
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};

export default useWallet;
