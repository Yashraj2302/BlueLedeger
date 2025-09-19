const express = require('express');
const router = express.Router();

// Mock oracle data
const oracleSummaries = {
  'attest_001': {
    projectId: 'proj_001',
    vintage: 2025,
    tCO2e: 61.2,
    evidenceCID: 'QmEvidenceHash123...',
    metricsHash: 'QmMetricsHash123...',
    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    signature: '0x1234567890abcdef...'
  }
};

// GET /api/v1/oracle/summary/:attestationId
router.get('/summary/:attestationId', async (req, res) => {
  try {
    const { attestationId } = req.params;
    const summary = oracleSummaries[attestationId];
    
    if (!summary) {
      return res.status(404).json({ error: 'Attestation not found' });
    }
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching oracle summary:', error);
    res.status(500).json({ error: 'Failed to fetch oracle summary' });
  }
});

module.exports = router;
