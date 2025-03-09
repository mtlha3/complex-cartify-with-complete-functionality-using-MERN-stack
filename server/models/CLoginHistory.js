import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  email: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const CLoginHistory = mongoose.model("CLoginHistory", loginHistorySchema);
export default CLoginHistory;
