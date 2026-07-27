const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @route   POST /api/projects
// @desc    Create a project (Client only)
// @access  Private
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'Client') {
    return res.status(403).json({ message: 'Only clients can post projects' });
  }

  try {
    const { title, description, budget } = req.body;
    const project = await Project.create({
      title,
      description,
      budget,
      client: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects/me
// @desc    Get logged in user's projects
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects
// @desc    Get all open projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Open' }).populate('client', 'name rating');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name rating');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
