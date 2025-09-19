const express = require('express');
const router = express.Router();
const { ingestMRV, getLatestMRV } = require('../services/mrvService');
const { validateMRVInput } = require('../middleware/validation');

// POST /api/v1/mrv/:projectId/ingest
router.post('/:projectId/ingest', validateMRVInput, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { metrics, evidenceCID, schemaVersion } = req.body;
    
    const result = await ingestMRV(projectId, {
      metrics,
      evidenceCID,
      schemaVersion
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error ingesting MRV:', error);
    res.status(500).json({ error: 'Failed to ingest MRV data' });
  }
});

// GET /api/v1/mrv/:projectId/latest
router.get('/:projectId/latest', async (req, res) => {
  try {
    const { projectId } = req.params;
    const mrvData = await getLatestMRV(projectId);
    
    if (!mrvData) {
      return res.status(404).json({ error: 'No MRV data found for project' });
    }
    
    res.json(mrvData);
  } catch (error) {
    console.error('Error fetching MRV data:', error);
    res.status(500).json({ error: 'Failed to fetch MRV data' });
  }
});

module.exports = router;
