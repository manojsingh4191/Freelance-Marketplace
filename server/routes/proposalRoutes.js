const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @route   POST /api/proposals
// @desc    Submit a proposal (Freelancer only)
// @access  Private
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'Freelancer') {
    return res.status(403).json({ message: 'Only freelancers can submit proposals' });
  }

  try {
    const { project, coverLetter, bidAmount } = req.body;

    const existingProposal = await Proposal.findOne({ project, freelancer: req.user._id });
    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this project' });
    }

    const proposal = await Proposal.create({
      project,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
    });
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/proposals/me
// @desc    Get logged in user's proposals (Freelancer)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id }).populate('project');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/proposals/project/:projectId
// @desc    Get proposals for a project (Client only)
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these proposals' });
    }

    const proposals = await Proposal.find({ project: req.params.projectId }).populate('freelancer', 'name rating profileDetails');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/proposals/:id/accept
// @desc    Accept a proposal (Client only)
// @access  Private
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    if (proposal.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    proposal.status = 'Accepted';
    await proposal.save();

    proposal.project.status = 'In Progress';
    await proposal.project.save();

    await Proposal.updateMany(
      { project: proposal.project._id, _id: { $ne: proposal._id } },
      { $set: { status: 'Denied' } }
    );

    res.json({ message: 'Proposal accepted', proposal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
