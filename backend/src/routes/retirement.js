const express = require('express');
const router = express.Router();
const { retireCredits } = require('../services/retirementService');
const { validateRetirementInput } = require('../middleware/validation');

// POST /api/v1/retire
router.post('/', validateRetirementInput, async (req, res) => {
  try {
    const { holder, tokenId, amount } = req.body;
    
    const result = await retireCredits({
      holder,
      tokenId,
      amount
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error retiring credits:', error);
    res.status(500).json({ error: 'Failed to retire credits' });
  }
});

module.exports = router;
