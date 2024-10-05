const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
      required: false,
    },
    refund_id: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    pgType: {
      type: String,
      default: "razorpay",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
