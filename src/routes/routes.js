const express = require('express');
const {createPayment,verifyPayment, createPaymentRefund,  webhook, getAllTransactions, getTransaction } = require('../controller/transactionController');

const router = express.Router();

router.post('/payment/create-payment', createPayment);
router.post('/payment/verify-payment', verifyPayment);
router.post('/payment/create-payment-refund', createPaymentRefund);
router.post('/payment/webhook', webhook);
router.get('/payment', getAllTransactions); 
router.get('/payment/:id', getTransaction);

module.exports = router;
