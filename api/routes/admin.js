const express = require('express');
const router = express.Router();

// Mock admin users (in production, use proper authentication)
const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin'
  }
];

// Mock projects database
let projects = [
  {
    id: 1,
    name: 'Mangrove Restoration - Sundarbans',
    description: 'Large-scale mangrove restoration project in the Sundarbans delta region',
    submitter: '0x742d35Cc6634C0532925a3b8D0C0C4C4C4C4C4C4',
    status: 'pending',
    submittedAt: '2025-01-15T10:30:00Z',
    area: 150.5,
    methodology: 'VCS VM0034',
    location: 'West Bengal, India',
    geojsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { plot_id: 'plot_001', species: 'Rhizophora mucronata' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[88.1234, 21.5678], [88.1245, 21.5678], [88.1245, 21.5689], [88.1234, 21.5689], [88.1234, 21.5678]]]
          }
        }
      ]
    },
    documents: ['project_proposal.pdf', 'environmental_impact.pdf']
  },
  {
    id: 2,
    name: 'Seagrass Restoration - Gulf of Mannar',
    description: 'Seagrass restoration project in the Gulf of Mannar Marine National Park',
    submitter: '0x8a9b2c3d4e5f6789012345678901234567890abcd',
    status: 'pending',
    submittedAt: '2025-01-14T14:20:00Z',
    area: 75.3,
    methodology: 'VCS VM0035',
    location: 'Tamil Nadu, India',
    geojsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { plot_id: 'plot_002', species: 'Halophila ovalis' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[79.1234, 9.5678], [79.1245, 9.5678], [79.1245, 9.5689], [79.1234, 9.5689], [79.1234, 9.5678]]]
          }
        }
      ]
    },
    documents: ['seagrass_study.pdf', 'restoration_plan.pdf']
  },
  {
    id: 3,
    name: 'Salt Marsh Restoration - Chilika',
    description: 'Salt marsh restoration project around Chilika Lake',
    submitter: '0x1a2b3c4d5e6f7890123456789012345678901234ef',
    status: 'approved',
    submittedAt: '2025-01-10T09:15:00Z',
    area: 45.2,
    methodology: 'Custom',
    location: 'Odisha, India',
    geojsonData: null,
    documents: ['chilika_restoration.pdf']
  }
];

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = adminUsers.find(u => u.username === username && u.password === password);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, use JWT tokens
    const token = `admin_token_${admin.id}_${Date.now()}`;
    
    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const { status } = req.query;
    
    let filteredProjects = projects;
    if (status && status !== 'all') {
      filteredProjects = projects.filter(p => p.status === status);
    }
    
    res.json(filteredProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.find(p => p.id === parseInt(id));
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Approve project
router.post('/projects/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: req.headers['x-admin-user'] || 'admin'
    };
    
    // In production, trigger MRV pipeline and token minting here
    console.log(`Project ${id} approved. Triggering MRV pipeline...`);
    
    res.json({ 
      message: 'Project approved successfully',
      project: projects[projectIndex]
    });
  } catch (error) {
    console.error('Error approving project:', error);
    res.status(500).json({ error: 'Failed to approve project' });
  }
});

// Reject project
router.post('/projects/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }
    
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.headers['x-admin-user'] || 'admin',
      rejectionReason: reason
    };
    
    // In production, send rejection notification to submitter
    console.log(`Project ${id} rejected. Reason: ${reason}`);
    
    res.json({ 
      message: 'Project rejected successfully',
      project: projects[projectIndex]
    });
  } catch (error) {
    console.error('Error rejecting project:', error);
    res.status(500).json({ error: 'Failed to reject project' });
  }
});

// Get project statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: projects.length,
      pending: projects.filter(p => p.status === 'pending').length,
      approved: projects.filter(p => p.status === 'approved').length,
      rejected: projects.filter(p => p.status === 'rejected').length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
