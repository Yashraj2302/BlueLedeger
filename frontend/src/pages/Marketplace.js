import React from 'react';
import { ShoppingCart, Leaf, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';

const Marketplace = () => {
  const { isConnected } = useWalletContext();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blue Carbon Credits Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Buy and sell verified blue carbon credits from coastal restoration projects.
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
                    Please connect your MetaMask wallet to buy and sell blue carbon credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="input-field w-48">
              <option>All Projects</option>
              <option>Mangrove Restoration</option>
              <option>Seagrass Restoration</option>
              <option>Salt Marsh Restoration</option>
            </select>
            <select className="input-field w-48">
              <option>All Vintages</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
            <select className="input-field w-48">
              <option>Price Range</option>
              <option>$10 - $25</option>
              <option>$25 - $50</option>
              <option>$50+</option>
            </select>
            <button className="btn-primary">Filter</button>
          </div>
        </div>

        {/* Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Card 1 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-ocean-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">Mangrove Credits</h3>
                <p className="text-sm text-gray-600">Sundarbans, West Bengal</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">150 credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">$35 per credit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vintage:</span>
                <span className="font-medium">2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Methodology:</span>
                <span className="font-medium">VCS VM0034</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-1" />
                Verified
              </div>
              <button className="btn-primary flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Credits
              </button>
            </div>
          </div>

          {/* Credit Card 2 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">Seagrass Credits</h3>
                <p className="text-sm text-gray-600">Gulf of Mannar, Tamil Nadu</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">75 credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">$28 per credit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vintage:</span>
                <span className="font-medium">2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Methodology:</span>
                <span className="font-medium">VCS VM0035</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-1" />
                Verified
              </div>
              <button className="btn-primary flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Credits
              </button>
            </div>
          </div>

          {/* Credit Card 3 */}
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">Salt Marsh Credits</h3>
                <p className="text-sm text-gray-600">Chilika, Odisha</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">200 credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">$42 per credit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vintage:</span>
                <span className="font-medium">2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Methodology:</span>
                <span className="font-medium">Custom</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-1" />
                Verified
              </div>
              <button className="btn-primary flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Credits
              </button>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Market Volume</h3>
            <p className="text-3xl font-bold text-green-600">$1.2M</p>
            <p className="text-sm text-gray-600">Total traded</p>
          </div>
          
          <div className="card text-center">
            <Leaf className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Credits Available</h3>
            <p className="text-3xl font-bold text-ocean-600">2,500</p>
            <p className="text-sm text-gray-600">Active listings</p>
          </div>
          
          <div className="card text-center">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Verified Projects</h3>
            <p className="text-3xl font-bold text-purple-600">15</p>
            <p className="text-sm text-gray-600">Active projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
