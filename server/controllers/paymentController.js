const Payment = require('../models/Payment');
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');

const processPayment = async (req, res) => {
  try {
    const { projectId, paymentMethod } = req.body;
    
    // Find the accepted proposal for this project to get the agreed amount
    const proposal = await Proposal.findOne({ project: projectId, status: 'Accepted' }).populate('freelancer');
    if (!proposal) {
      return res.status(400).json({ message: 'No accepted proposal found for this project.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Mock payment processing
    const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);

    const payment = await Payment.create({
      project: projectId,
      client: req.user._id,
      freelancer: proposal.freelancer._id,
      amount: proposal.bidAmount, // Dynamic bargained amount
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Completed',
      transactionId
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    // Fetch payments where user is either client or freelancer
    const payments = await Payment.find({
      $or: [{ client: req.user._id }, { freelancer: req.user._id }]
    })
    .populate('project', 'title')
    .populate('client', 'name')
    .populate('freelancer', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getPaymentHistory
};
