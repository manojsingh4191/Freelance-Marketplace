const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a review (after project completion)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { project, reviewee, rating, comment } = req.body;
    
    const projectData = await Project.findById(project);
    if (!projectData) return res.status(404).json({ message: 'Project not found' });

    if (projectData.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }

    const review = await Review.create({
      project,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
