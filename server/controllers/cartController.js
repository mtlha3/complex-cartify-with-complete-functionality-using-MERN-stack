import Cart from "../models/Cart.js";


// controller for adding products to a cart by customer
export const addToCart = async (req, res) => {
  try {
    console.log("✅ Token verified:", req.user);
    const userId = req.user.id;


    console.log("🛒 Received cart data:", req.body);

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const { productId, name, price, quantity, sellerId } = req.body;

    if (!productId || !name || !price || !quantity || !sellerId) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, name, price, quantity, totalPrice: price * quantity, sellerId }]
      });
    } else {
      const existingProductIndex = cart.products.findIndex((p) => p.productId === productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
        cart.products[existingProductIndex].totalPrice = cart.products[existingProductIndex].quantity * price;
      } else {
        cart.products.push({ productId, name, price, quantity, totalPrice: price * quantity, sellerId });
      }
    }

    await cart.save();
    res.status(201).json(cart);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



// controller for fetching cart products add by customer
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ message: "Cart is empty", products: [] });
    }

    res.status(200).json(cart.products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// controller for delete specific product from cart
export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const productIndex = cart.products.findIndex((p) => p.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    await cart.save();
    res.status(200).json(cart.products);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// controller for incrementing product quantity in cart
export const incrementQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const productIndex = cart.products.findIndex((p) => p.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products[productIndex].quantity += 1;
    cart.products[productIndex].totalPrice = cart.products[productIndex].quantity * cart.products[productIndex].price;

    await cart.save();
    res.status(200).json(cart.products);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// controller for decrementing product quantity in cart
export const decrementQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from token" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const productIndex = cart.products.findIndex((p) => p.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
      cart.products[productIndex].totalPrice = cart.products[productIndex].quantity * cart.products[productIndex].price;
    }

    await cart.save();
    res.status(200).json(cart.products);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

