const express = require('express');
const router = express.Router();
const { getOracleSummary } = require('../services/oracleService');

// GET /api/v1/oracle/summary/:attestationId
router.get('/summary/:attestationId', async (req, res) => {
  try {
    const { attestationId } = req.params;
    const summary = await getOracleSummary(attestationId);
    
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
