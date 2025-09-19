const express = require('express');
const router = express.Router();

// Mock minting data
const mintedCredits = [];

// POST /api/v1/mint
router.post('/', async (req, res) => {
  try {
    const { projectId, vintage, amount, evidenceCID, attestationId } = req.body;
    
    const tokenId = `token_${Date.now()}`;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const mintRecord = {
      tokenId,
      projectId,
      vintage,
      amount,
      evidenceCID,
      attestationId,
      txHash,
      timestamp: new Date().toISOString()
    };
    
    mintedCredits.push(mintRecord);
    
    res.status(201).json({
      tokenId,
      txHash
    });
  } catch (error) {
    console.error('Error minting credits:', error);
    res.status(500).json({ error: 'Failed to mint credits' });
  }
});

// GET /api/v1/mint
router.get('/', async (req, res) => {
  try {
    res.json(mintedCredits);
  } catch (error) {
    console.error('Error fetching minted credits:', error);
    res.status(500).json({ error: 'Failed to fetch minted credits' });
  }
});

module.exports = router;
