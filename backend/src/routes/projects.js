const express = require('express');
const router = express.Router();
const { createProject, getProject } = require('../services/projectService');
const { validateProjectInput } = require('../middleware/validation');

// POST /api/v1/projects
router.post('/', validateProjectInput, async (req, res) => {
  try {
    const { name, ownerAddress, geojsonCID, geojsonInline, metadata } = req.body;
    
    const result = await createProject({
      name,
      ownerAddress,
      geojsonCID,
      geojsonInline,
      metadata
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/v1/projects/:projectId
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router;
