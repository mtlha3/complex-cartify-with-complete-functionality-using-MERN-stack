import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  sellerId: { type: Number, required: true, unique: true },
  Storename: { type: String, required: true},
  products: [
    {
      productId: { type: Number, required: true }, 
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
