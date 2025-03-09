import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    products: [
      {
        productId: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        totalPrice: { type: Number, required: true },
        sellerId: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
