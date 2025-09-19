const express = require('express');
const router = express.Router();
const { mintCredits } = require('../services/mintService');
const { validateMintInput } = require('../middleware/validation');

// POST /api/v1/mint
router.post('/', validateMintInput, async (req, res) => {
  try {
    const { projectId, vintage, amount, evidenceCID, attestationId } = req.body;
    
    const result = await mintCredits({
      projectId,
      vintage,
      amount,
      evidenceCID,
      attestationId
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error minting credits:', error);
    res.status(500).json({ error: 'Failed to mint credits' });
  }
});

module.exports = router;
