import Transaction from "../models/transaction.js";

export const revenueReport = async (req, res) => {
  try {
    const report = await Transaction.aggregate([
      {
        $group: {
          _id: "$vendorId",
          totalRevenue: { $sum: "$totalAmount" },
          totalUnitsSold: { $sum: "$quantity" }
        }
      }
    ]);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};