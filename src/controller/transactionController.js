const transactionService = require("../services/transactionService");

exports.createPayment = async (req, res) => {
  try {
    const message = await transactionService.createPayment(req, res);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const message = await transactionService.verifyPayment(req);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    const message = await transactionService.webhook(req);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPaymentRefund = async (req, res) => {
  try {
    const message = await transactionService.createPaymentRefund(req);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const message = await transactionService.getAllTransactions(req);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const message = await transactionService.getTransaction(req);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
