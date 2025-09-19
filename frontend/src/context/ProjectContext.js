import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '../services/walletService';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [userBalances, setUserBalances] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('blueLedgerProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('blueLedgerProjects', JSON.stringify(projects));
  }, [projects]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('blueLedgerTransactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('blueLedgerTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const addProject = (projectData) => {
    const newProject = {
      id: Date.now(), // Simple ID generation
      ...projectData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      credits: {
        total: 0,
        available: 0,
        retired: 0,
        pricePerCredit: 50 // $50 per credit
      }
    };
    
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProjectStatus = (projectId, status, additionalData = {}) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updatedProject = {
          ...project,
          status,
          ...additionalData,
          updatedAt: new Date().toISOString()
        };

        // If approved, calculate credits based on area
        if (status === 'approved') {
          const estimatedCredits = Math.floor(project.area * 10); // 10 credits per hectare
          updatedProject.credits = {
            total: estimatedCredits,
            available: estimatedCredits,
            retired: 0,
            pricePerCredit: 50
          };
        }

        return updatedProject;
      }
      return project;
    }));
  };

  const getProjectsByStatus = (status) => {
    return projects.filter(project => project.status === status);
  };

  const getApprovedProjects = () => {
    return projects.filter(project => project.status === 'approved');
  };

  const buyCredits = async (projectId, amount, userAddress) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.credits.available < amount) {
        throw new Error('Not enough credits available');
      }

      // Simulate wallet transaction
      const txResult = await walletService.buyCredits(
        projectId, 
        amount, 
        project.credits.pricePerCredit, 
        userAddress
      );

      // Update project credits
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            credits: {
              ...project.credits,
              available: project.credits.available - amount
            }
          };
        }
        return project;
      }));

      // Add transaction to history
      const newTransaction = {
        id: Date.now(),
        type: 'buy',
        projectId,
        projectName: project.name,
        amount,
        pricePerCredit: project.credits.pricePerCredit,
        totalCost: txResult.totalCost,
        txHash: txResult.txHash,
        userAddress,
        timestamp: txResult.timestamp
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update user balance
      setUserBalances(prev => ({
        ...prev,
        [userAddress]: {
          ...prev[userAddress],
          totalOwned: (prev[userAddress]?.totalOwned || 0) + amount,
          totalSpent: (prev[userAddress]?.totalSpent || 0) + txResult.totalCost
        }
      }));

      return txResult;
    } catch (error) {
      console.error('Error buying credits:', error);
      throw error;
    }
  };

  const retireCredits = async (projectId, amount, userAddress) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      if (project.credits.available < amount) {
        throw new Error('Not enough credits available');
      }

      // Check if user has enough credits to retire
      const userBalance = userBalances[userAddress]?.totalOwned || 0;
      if (userBalance < amount) {
        throw new Error('Insufficient credit balance');
      }

      // Simulate wallet transaction
      const txResult = await walletService.retireCredits(
        projectId, 
        amount, 
        project.credits.pricePerCredit, 
        userAddress
      );

      // Update project credits
      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            credits: {
              ...project.credits,
              available: project.credits.available - amount,
              retired: project.credits.retired + amount
            }
          };
        }
        return project;
      }));

      // Add transaction to history
      const newTransaction = {
        id: Date.now(),
        type: 'retire',
        projectId,
        projectName: project.name,
        amount,
        pricePerCredit: project.credits.pricePerCredit,
        totalCost: txResult.totalCost,
        txHash: txResult.txHash,
        userAddress,
        timestamp: txResult.timestamp
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Update user balance
      setUserBalances(prev => ({
        ...prev,
        [userAddress]: {
          ...prev[userAddress],
          totalOwned: (prev[userAddress]?.totalOwned || 0) - amount,
          totalRetired: (prev[userAddress]?.totalRetired || 0) + amount,
          totalSpent: (prev[userAddress]?.totalSpent || 0) + txResult.totalCost
        }
      }));

      return txResult;
    } catch (error) {
      console.error('Error retiring credits:', error);
      throw error;
    }
  };

  const getUserBalance = (userAddress) => {
    return userBalances[userAddress] || {
      totalOwned: 0,
      totalRetired: 0,
      totalSpent: 0
    };
  };

  const getUserTransactions = (userAddress) => {
    return transactions.filter(tx => tx.userAddress === userAddress);
  };

  const loadUserBalance = async (userAddress) => {
    try {
      const balance = await walletService.getUserCreditBalance(userAddress);
      setUserBalances(prev => ({
        ...prev,
        [userAddress]: balance
      }));
      return balance;
    } catch (error) {
      console.error('Error loading user balance:', error);
      return getUserBalance(userAddress);
    }
  };

  const value = {
    projects,
    userBalances,
    transactions,
    addProject,
    updateProjectStatus,
    getProjectsByStatus,
    getApprovedProjects,
    buyCredits,
    retireCredits,
    getUserBalance,
    getUserTransactions,
    loadUserBalance
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
