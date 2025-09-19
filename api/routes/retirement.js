const express = require('express');
const router = express.Router();

// Mock retirement data
const retirementCertificates = [];

// POST /api/v1/retire
router.post('/', async (req, res) => {
  try {
    const { holder, tokenId, amount } = req.body;
    
    const certificateId = `cert_${Date.now()}`;
    const burnTx = `0x${Math.random().toString(16).substr(2, 64)}`;
    const certificateTx = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const retirementRecord = {
      certificateId,
      holder,
      tokenId,
      amount,
      burnTx,
      certificateTx,
      timestamp: new Date().toISOString()
    };
    
    retirementCertificates.push(retirementRecord);
    
    res.status(201).json({
      certificateId,
      txHash: certificateTx
    });
  } catch (error) {
    console.error('Error retiring credits:', error);
    res.status(500).json({ error: 'Failed to retire credits' });
  }
});

// GET /api/v1/retire
router.get('/', async (req, res) => {
  try {
    res.json(retirementCertificates);
  } catch (error) {
    console.error('Error fetching retirement certificates:', error);
    res.status(500).json({ error: 'Failed to fetch retirement certificates' });
  }
});

module.exports = router;
