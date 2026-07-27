const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Denied'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
