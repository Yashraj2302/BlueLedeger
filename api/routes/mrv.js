const express = require('express');
const router = express.Router();

// Mock MRV data
const mrvData = {
  'proj_001': {
    attestationId: 'attest_001',
    metrics: {
      totalAreaHectares: 150.5,
      baselineAGB: 12.3,
      currentAGB: 45.7,
      agbDelta: 33.4,
      carbonStock: 16.7,
      tCO2e: 61.2,
      uncertainty: 0.15
    },
    evidenceCID: 'QmEvidenceHash123...',
    schemaVersion: '1.0.0',
    timestamp: '2025-01-15T10:30:00Z'
  }
};

// POST /api/v1/mrv/:projectId/ingest
router.post('/:projectId/ingest', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { metrics, evidenceCID, schemaVersion } = req.body;
    
    const attestationId = `attest_${Date.now()}`;
    
    mrvData[projectId] = {
      attestationId,
      metrics,
      evidenceCID,
      schemaVersion: schemaVersion || '1.0.0',
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json({
      attestationId,
      metricsHash: 'QmMetricsHash123...'
    });
  } catch (error) {
    console.error('Error ingesting MRV:', error);
    res.status(500).json({ error: 'Failed to ingest MRV data' });
  }
});

// GET /api/v1/mrv/:projectId/latest
router.get('/:projectId/latest', async (req, res) => {
  try {
    const { projectId } = req.params;
    const mrv = mrvData[projectId];
    
    if (!mrv) {
      return res.status(404).json({ error: 'No MRV data found for project' });
    }
    
    res.json(mrv);
  } catch (error) {
    console.error('Error fetching MRV data:', error);
    res.status(500).json({ error: 'Failed to fetch MRV data' });
  }
});

module.exports = router;
