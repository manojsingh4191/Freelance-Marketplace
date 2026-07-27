const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { processPayment, getPaymentHistory } = require('../controllers/paymentController');

router.post('/pay', protect, processPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
