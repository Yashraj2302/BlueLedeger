import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
