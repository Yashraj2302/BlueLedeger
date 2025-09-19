import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { useProjectContext } from '../context/ProjectContext';
import { 
  Wallet, 
  Leaf, 
  History, 
  CheckCircle, 
  Clock,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { isConnected, account } = useWalletContext();
  const { 
    getUserBalance, 
    getUserTransactions, 
    loadUserBalance 
  } = useProjectContext();
  const [userBalance, setUserBalance] = useState({
    totalOwned: 0,
    totalRetired: 0,
    totalSpent: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      setIsLoading(true);
      loadUserBalance(account).then(balance => {
        setUserBalance(balance);
        setIsLoading(false);
      });
    }
  }, [isConnected, account, loadUserBalance]);

  // Update user balance from context
  useEffect(() => {
    if (account) {
      const balance = getUserBalance(account);
      setUserBalance(balance);
      const userTxs = getUserTransactions(account);
      setTransactions(userTxs);
    }
  }, [account, getUserBalance, getUserTransactions]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTxHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
            <p className="text-gray-600">
              Please connect your MetaMask wallet to view your carbon credit dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">
            Track your blue carbon credit portfolio and transaction history.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Wallet: {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Credits Owned</h3>
            <p className="text-3xl font-bold text-green-600">{userBalance.totalOwned}</p>
            <p className="text-sm text-gray-600">Available for trading</p>
          </div>
          
          <div className="card text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Credits Retired</h3>
            <p className="text-3xl font-bold text-blue-600">{userBalance.totalRetired}</p>
            <p className="text-sm text-gray-600">Permanently retired</p>
          </div>
          
          <div className="card text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
            <p className="text-3xl font-bold text-purple-600">${userBalance.totalSpent}</p>
            <p className="text-sm text-gray-600">On carbon credits</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <History className="h-5 w-5 text-gray-400" />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-600">
                Start by buying or retiring carbon credits in the marketplace.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.type === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tx.type === 'buy' ? 'Buy' : 'Retire'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.projectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount} credits
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${tx.pricePerCredit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${tx.totalCost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a 
                          href={`https://polygonscan.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ocean-600 hover:text-ocean-800"
                        >
                          {formatTxHash(tx.txHash)}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/marketplace"
                className="block w-full text-center px-4 py-2 bg-ocean-600 text-white rounded-md hover:bg-ocean-700 transition-colors"
              >
                Buy Carbon Credits
              </a>
              <a
                href="/marketplace"
                className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Retire Credits
              </a>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Credits:</span>
                <span className="font-medium">{userBalance.totalOwned + userBalance.totalRetired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Credits:</span>
                <span className="font-medium text-green-600">{userBalance.totalOwned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retired Credits:</span>
                <span className="font-medium text-blue-600">{userBalance.totalRetired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Investment:</span>
                <span className="font-medium text-purple-600">${userBalance.totalSpent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;