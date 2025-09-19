import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { useProjectContext } from '../context/ProjectContext';
import { 
  ShoppingCart, 
  Leaf, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const { isConnected, account } = useWalletContext();
  const { 
    getApprovedProjects, 
    buyCredits, 
    retireCredits, 
    getUserBalance, 
    loadUserBalance 
  } = useProjectContext();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [retireAmount, setRetireAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState({
    totalOwned: 0,
    totalRetired: 0,
    totalSpent: 0
  });

  const approvedProjects = getApprovedProjects();

  // Load user balance when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      loadUserBalance(account).then(balance => {
        setUserBalance(balance);
      });
    }
  }, [isConnected, account, loadUserBalance]);

  // Update user balance from context
  useEffect(() => {
    if (account) {
      const balance = getUserBalance(account);
      setUserBalance(balance);
    }
  }, [account, getUserBalance]);

  const handleBuyCredits = (project) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedProject(project);
    setShowBuyModal(true);
  };

  const handleRetireCredits = (project) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedProject(project);
    setShowRetireModal(true);
  };

  const confirmBuy = async () => {
    const amount = parseInt(buyAmount);
    if (amount <= 0 || amount > selectedProject.credits.available) {
      toast.error('Invalid amount');
      return;
    }

    setIsProcessing(true);
    try {
      const txResult = await buyCredits(selectedProject.id, amount, account);
      
      toast.success(
        `Successfully bought ${amount} credits! Transaction: ${txResult.txHash.slice(0, 10)}...`
      );
      
      setShowBuyModal(false);
      setBuyAmount('');
      setSelectedProject(null);
    } catch (error) {
      toast.error(error.message || 'Failed to buy credits');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmRetire = async () => {
    const amount = parseInt(retireAmount);
    if (amount <= 0 || amount > selectedProject.credits.available) {
      toast.error('Invalid amount');
      return;
    }

    if (amount > userBalance.totalOwned) {
      toast.error('Insufficient credit balance');
      return;
    }

    setIsProcessing(true);
    try {
      const txResult = await retireCredits(selectedProject.id, amount, account);
      
      toast.success(
        `Successfully retired ${amount} credits! Transaction: ${txResult.txHash.slice(0, 10)}...`
      );
      
      setShowRetireModal(false);
      setRetireAmount('');
      setSelectedProject(null);
    } catch (error) {
      toast.error(error.message || 'Failed to retire credits');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCredits = approvedProjects.reduce((sum, project) => sum + project.credits.total, 0);
  const availableCredits = approvedProjects.reduce((sum, project) => sum + project.credits.available, 0);
  const retiredCredits = approvedProjects.reduce((sum, project) => sum + project.credits.retired, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blue Carbon Credits Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Buy and retire verified blue carbon credits from approved coastal restoration projects.
          </p>
        </div>

        {/* Wallet Connection Notice */}
        {!isConnected && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="card border-orange-200 bg-orange-50">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Connect Your Wallet</h3>
                  <p className="text-sm text-orange-600">
                    Please connect your MetaMask wallet to buy and retire blue carbon credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Balance */}
        {isConnected && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="card border-green-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">Your Credit Balance</h3>
                  <p className="text-sm text-green-600">
                    Wallet: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{userBalance.totalOwned}</p>
                    <p className="text-sm text-green-600">Credits Owned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{userBalance.totalRetired}</p>
                    <p className="text-sm text-green-600">Credits Retired</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">${userBalance.totalSpent}</p>
                    <p className="text-sm text-green-600">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Total Credits</h3>
            <p className="text-3xl font-bold text-green-600">{totalCredits}</p>
            <p className="text-sm text-gray-600">Credits generated</p>
          </div>
          
          <div className="card text-center">
            <Leaf className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Available</h3>
            <p className="text-3xl font-bold text-ocean-600">{availableCredits}</p>
            <p className="text-sm text-gray-600">Credits for sale</p>
          </div>
          
          <div className="card text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Retired</h3>
            <p className="text-3xl font-bold text-purple-600">{retiredCredits}</p>
            <p className="text-sm text-gray-600">Credits retired</p>
          </div>
        </div>

        {/* Projects Grid */}
        {approvedProjects.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Approved Projects</h3>
            <p className="text-gray-600">
              No projects have been approved yet. Check back later for available carbon credits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedProjects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-ocean-100 p-3 rounded-lg">
                    <Leaf className="h-6 w-6 text-ocean-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{project.credits.available} credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">${project.credits.pricePerCredit} per credit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">{project.area} hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Methodology:</span>
                    <span className="font-medium">{project.methodology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Retired:</span>
                    <span className="font-medium">{project.credits.retired} credits</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleBuyCredits(project)}
                      disabled={!isConnected || project.credits.available === 0}
                      className="btn-primary flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy
                    </button>
                    <button 
                      onClick={() => handleRetireCredits(project)}
                      disabled={!isConnected || project.credits.available === 0}
                      className="btn-secondary flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Retire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buy Modal */}
        {showBuyModal && selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Buy Carbon Credits</h3>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Project: {selectedProject.name}</p>
                <p className="text-sm text-gray-600 mb-2">Available: {selectedProject.credits.available} credits</p>
                <p className="text-sm text-gray-600 mb-4">Price: ${selectedProject.credits.pricePerCredit} per credit</p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits
                </label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  placeholder="Enter amount"
                  min="1"
                  max={selectedProject.credits.available}
                />
              </div>
              
              {buyAmount && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Total Cost: ${(parseInt(buyAmount) || 0) * selectedProject.credits.pricePerCredit}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBuy}
                  disabled={isProcessing || !buyAmount || parseInt(buyAmount) <= 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-ocean-600 hover:bg-ocean-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Buy Credits</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retire Modal */}
        {showRetireModal && selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Retire Carbon Credits</h3>
                <button
                  onClick={() => setShowRetireModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Project: {selectedProject.name}</p>
                <p className="text-sm text-gray-600 mb-2">Available: {selectedProject.credits.available} credits</p>
                <p className="text-sm text-gray-600 mb-4">Price: ${selectedProject.credits.pricePerCredit} per credit</p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits to Retire
                </label>
                <input
                  type="number"
                  value={retireAmount}
                  onChange={(e) => setRetireAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  placeholder="Enter amount"
                  min="1"
                  max={selectedProject.credits.available}
                />
              </div>
              
              {retireAmount && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Total Cost: ${(parseInt(retireAmount) || 0) * selectedProject.credits.pricePerCredit}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Retiring credits removes them from circulation permanently
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRetireModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRetire}
                  disabled={isProcessing || !retireAmount || parseInt(retireAmount) <= 0 || parseInt(retireAmount) > userBalance.totalOwned}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Retire Credits</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;