import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: Number, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, 
  sellerId: { type: Number, ref: 'Seller', required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true },
  userId: {
    type: Number,
    ref: 'User',
    required: true,
  },
  formInformation: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ['COD', 'CreditCard'] }, 
  },
  cartItems: [cartItemSchema],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
    default: 'Pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});



orderSchema.statics.incrementId = async function () {
    const lastUser = await this.findOne().sort({ Id: -1 });
    return lastUser && lastUser.Id ? lastUser.Id + 1 : 1;
  };
  
 orderSchema.pre("save", async function (next) {
    if (this.isNew) {
      try {
        this.Id = await this.constructor.incrementId();
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });
  

const Order = mongoose.model('Order', orderSchema);

export default Order;


