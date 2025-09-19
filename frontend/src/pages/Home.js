import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Leaf, Globe, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-50 to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              BlueLedger
              <span className="text-ocean-600"> System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Blockchain-based blue carbon credit registry and MRV system. 
              Turn coastal restoration into verifiable climate currency using 
              satellite imagery, blockchain technology, and transparent verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects" className="btn-primary text-lg px-8 py-3">
                Start Project
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/marketplace" className="btn-secondary text-lg px-8 py-3">
                Browse Credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How BlueLedger System Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our blockchain-based registry ensures transparency, prevents double-counting, 
              and provides verifiable blue carbon credits from coastal ecosystems using 
              satellite imagery and field data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-ocean-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Onboarding</h3>
              <p className="text-gray-600">
                Users onboard projects using GeoJSON files containing coastal ecosystem boundaries and metadata.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MRV Pipeline</h3>
              <p className="text-gray-600">
                Uses satellite imagery and field data for MRV, leveraging Google Earth Engine and NDVI Biomass Model.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Token Minting</h3>
              <p className="text-gray-600">
                ERC-1155 tokens minted with evidence stored on IPFS, brought on-chain via Chainlink oracle.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                ERC-721 retirement certificates with revenue sharing for coastal communities via MetaMask and USDC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SIH 2025 Key Performance Indicators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our pilot targets for the Smart India Hackathon 2025
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">3</div>
              <div className="text-gray-600">Projects Onboarded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">10,000</div>
              <div className="text-gray-600">tCO2e Measured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">500</div>
              <div className="text-gray-600">Credits Issued</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">$</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* DAO Governance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Long-term Vision: National Registry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Using APIs and DAO governance to create a national blue carbon registry, 
              enabling scalable markets and transparent governance for India's climate goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable Markets</h3>
              <p className="text-gray-600">
                Nationwide adoption of blue carbon credit trading across India's coastal regions.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Empowerment</h3>
              <p className="text-gray-600">
                Direct revenue sharing with coastal communities through transparent governance.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Climate Impact</h3>
              <p className="text-gray-600">
                Significant contribution to India's carbon neutrality and climate action goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the BlueLedger ecosystem and help restore coastal ecosystems 
            while generating verifiable carbon credits for SIH 2025.
          </p>
          <Link to="/projects" className="btn-primary text-lg px-8 py-3">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5 inline" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
