const express = require('express');
const CV = require('../models/CV.cjs');

const router = express.Router();

// Create a new CV
router.post('/', async (req, res) => {
  try {
    const newCV = new CV(req.body);
    const savedCV = await newCV.save();
    res.status(201).json(savedCV);
  } catch (error) {
    res.status(500).json({ error: 'Error saving CV' });
  }
});

// Get a CV by ID
router.get('/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching CV' });
  }
});

// Update a CV by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCV = await CV.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCV);
  } catch (error) {
    res.status(500).json({ error: 'Error updating CV' });
  }
});

// Delete a CV by ID
router.delete('/:id', async (req, res) => {
  try {
    await CV.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting CV' });
  }
});

module.exports = router;
