import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";


// controller for placing orders with details
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone, paymentMethod } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    const totalAmount = cart.products.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    const nextId = await Order.incrementId();
    const newOrder = new Order({
      Id: nextId,
      userId,
      formInformation: { name, address, phone, paymentMethod },
      cartItems: cart.products,
      totalAmount,
    });

    await newOrder.save();

    for (const item of cart.products) {
      await Product.findOneAndUpdate(
        { "products.productId": item.productId },
        { $inc: { "products.$.quantity": -item.quantity } },
        { new: true }
      );
    }

    await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};




// Controller to get all orders for the authenticated user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



// Controller to get orders for a seller
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is missing from token" });
    }

    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).sort({ orderDate: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found for this seller." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// Controller to update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({ Id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const sellerAssociated = order.cartItems.some(item => item.sellerId === sellerId);

    if (!sellerAssociated) {
      return res.status(403).json({ message: 'You are not authorized to update the status of this order' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};