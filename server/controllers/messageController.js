const Message = require('../models/Message');
const Proposal = require('../models/Proposal');

// @desc    Get all active conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    let proposals;
    if (req.user.role === 'Client') {
      // Find proposals accepted by this client
      proposals = await Proposal.find({ status: 'Accepted' })
        .populate({
          path: 'project',
          match: { client: req.user._id }
        })
        .populate('freelancer', 'name');
        
      // Filter out proposals where project match failed (not this client's project)
      proposals = proposals.filter(p => p.project !== null);
    } else {
      // Find proposals accepted for this freelancer
      proposals = await Proposal.find({ status: 'Accepted', freelancer: req.user._id })
        .populate({
          path: 'project',
          populate: { path: 'client', select: 'name' }
        });
    }

    const conversations = proposals.map(p => {
      const otherUser = req.user.role === 'Client' ? p.freelancer : p.project.client;
      const roomId = `${p.project._id}-${p.freelancer._id || p.freelancer}`;
      return {
        roomId,
        project: { _id: p.project._id, title: p.project.title },
        otherUser: { _id: otherUser._id, name: otherUser.name }
      };
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all messages for a specific room
// @route   GET /api/messages/:roomId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages
};
