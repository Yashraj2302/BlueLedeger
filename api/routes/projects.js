const express = require('express');
const router = express.Router();

// Mock data for demonstration
const projects = [
  {
    projectId: 'proj_001',
    name: 'Mangrove Restoration - Sundarbans',
    ownerAddress: '0x742d35Cc6634C0532925a3b8D0C0C4C4C4C4C4C4',
    geoCID: 'QmProjectGeoHash123...',
    status: 'active',
    createdAt: '2025-01-15T10:30:00Z'
  }
];

// POST /api/v1/projects
router.post('/', async (req, res) => {
  try {
    const { name, ownerAddress, geojsonCID, geojsonInline, metadata } = req.body;
    
    const projectId = `proj_${Date.now()}`;
    const newProject = {
      projectId,
      name,
      ownerAddress,
      geoCID: geojsonCID || 'QmGeneratedHash...',
      status: 'active',
      createdAt: new Date().toISOString(),
      metadata
    };
    
    projects.push(newProject);
    
    res.status(201).json({
      projectId: newProject.projectId,
      geoCID: newProject.geoCID
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/v1/projects/:projectId
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = projects.find(p => p.projectId === projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// GET /api/v1/projects
router.get('/', async (req, res) => {
  try {
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

module.exports = router;
