const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  roomId: { type: String, required: true },
  expiresAt: { type: Date, expires: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
