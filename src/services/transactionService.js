const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");
const config = require("../config/config");

const Razorpay = require("razorpay");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
require("dotenv").config();

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: config.development.razorpayKeyId,
  key_secret: config.development.razorpayKeySecret,
});

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    const transaction = new Transaction({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });
    const response = await transaction.save();
    return { message: "payment created successfully", data: response };
  } catch (error) {
    logger.error(error);
    throw new Error("Error creating order");
  }
};

exports.verifyPayment = async (req) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const secret = razorpay.key_secret;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret
    );
    if (isValidSignature) {
      const transaction = await Transaction.findById(razorpay_order_id);

      if (!transaction) {
        console.error("Transaction not found:", razorpay_order_id);
        throw new Error("Transaction not found");
      }
      if (transaction) {
        transaction.status = "paid";
        transaction.payment_id = razorpay_payment_id;
        await transaction.save();
      }
      console.log("Payment verification successful");
      return {
        message: "Payment verification successfully",
        data: transaction,
      };
    } else {
      console.log("Payment verification failed");
      return { status: "verification_failed" };
    }
  } catch (error) {
    logger.error(error);
    throw new Error("Error verifying payment");
  }
};

exports.createPaymentRefund = async (req) => {
  try {
    const { payment_id, amount, speed, notes, receipt } = req.body;
    // Create a refund
    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount,
      speed: speed,
      notes: notes,
      receipt: receipt
    });

    const transaction = await Transaction.findOne({ payment_id: payment_id });

    if (!transaction) {
      console.error("Transaction not found:", payment_id);
      throw new Error("Transaction not found");
    }
    if (transaction) {
      transaction.status = "refund-processed";
      transaction.refund_id = refund.id;
      await transaction.save();
    }
    return { message: "Payment refund initiated successfully", data: refund };
  } catch (error) {
    console.error("Error creating refund:", error);
    throw new Error("Error creating refund");
  }
};

exports.webhook = async (req) => {
  const { headers, body } = req;
  const secret = razorpay.key_secret;
  const signature = headers["x-razorpay-signature"];

  // Verify the webhook signature
  const isValidSignature = validateWebhookSignature(
    JSON.stringify(body),
    signature,
    secret
  );
  if (isValidSignature) {
    const event = body.event;

    if (event === "refund.processed" || event === "refund.created") {
      const refund = body.payload.refund.entity;
      const refund_id = refund.id;
      const payment_id = refund.payment_id;
      const amount = refund.amount / 100; // Convert paise to INR

      // Handle refund event
      console.log(
        `Refund processed: ${refund_id} for payment ${payment_id} of amount ₹${amount}`
      );
      const transaction = await Transaction.findById(payment_id);

      if (!transaction) {
        console.error("transaction not found:", payment_id);
        throw new Error("transaction not found");
      }
      if (transaction) {
        transaction.status = "refunded";
        await transaction.save();
      }
    }
    return { message: "Event received" };
  } else {
    console.log("Invalid signature");
    throw new Error("Invalid signature");
  }
};
exports.getTransaction = async (req) => {
  const transaction_id = req.params.id;
  console.log("txn id", transaction_id);
  if (!transaction_id) {
    throw new Error("transaction id is required");
  }

  try {
    const transaction = await Transaction.findById(transaction_id);

    if (!transaction) {
      console.error("transaction not found:", transaction_id);
      throw new Error("transaction not found");
    }

    return { message: "transaction details", data: transaction };
  } catch (error) {
    console.error("Error in getting transaction details:", error.message);
    throw new Error("Failed to get transaction details");
  }
};

exports.getAllTransactions = async (req) => {
  const { page = 1, limit = 10, search = "", total, filters } = req.query;

  try {
    // Build query object
    let query = {};
    if (search) {
      query.status = new RegExp(search, "i"); // Case-insensitive search
    }
    if (total) {
      query.total = { $lte: parseFloat(total) }; // Less than or equal to total
    }
    // Handle additional filters
    if (filters) {
      filters.split(",").forEach((filter) => {
        const [key, value] = filter.split("|");
        if (key && value) {
          // Apply filter only if both key and value are present
          query[key] = value;
        }
      });
    }

    // Find transactions with pagination and filtering
    const transactions = await Transaction.find(query)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    // Get total count of transactions matching the query
    const totalCount = await Transaction.countDocuments(query);

    return {
      message: "transactions details list",
      data: transactions,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw new Error("Failed to fetch transactions");
  }
};
