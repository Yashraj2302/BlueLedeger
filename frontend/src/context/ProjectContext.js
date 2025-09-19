import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

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

  const buyCredits = (projectId, amount) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && project.credits.available >= amount) {
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
  };

  const retireCredits = (projectId, amount) => {
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
  };

  const value = {
    projects,
    addProject,
    updateProjectStatus,
    getProjectsByStatus,
    getApprovedProjects,
    buyCredits,
    retireCredits
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
