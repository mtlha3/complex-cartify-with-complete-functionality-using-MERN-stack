import Product from "../models/Product.js";
import User from "../models/User.js";


// Controller for adding products
export const addProduct = async (req, res) => {
  try {
    const { name, description ,price, quantity, image } = req.body;
    const sellerId = req.user.id;

    if (!name || !description || !price || !quantity || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const seller = await User.findOne({ Id: sellerId });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const sellerStoreName = seller.Storename;

    if (!sellerStoreName) {
      return res.status(400).json({ message: "Seller store name is missing" });
    }

    let sellerProducts = await Product.findOne({ sellerId });

    const productId = sellerProducts ? sellerProducts.products.length + 1 : 1;

    
    const newProduct = {
      productId,
      name,
      description,
      price,
      quantity,
      image,
    };

    if (sellerProducts) {
      sellerProducts.products.push(newProduct);
      await sellerProducts.save();
    } else {
      sellerProducts = new Product({
        sellerId,
        Storename: sellerStoreName, 
        products: [newProduct],
      });

      await sellerProducts.save();
    }

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controller for fetching products at seller end
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id; 
    const products = await Product.findOne({ sellerId });

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controller for delete products by seller
export const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = parseInt(req.params.id);

    let sellerProducts = await Product.findOne({ sellerId });

    if (!sellerProducts) {
      return res.status(404).json({ message: "Seller has no products" });
    }

    const productIndex = sellerProducts.products.findIndex(p => p.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    sellerProducts.products.splice(productIndex, 1);
    await sellerProducts.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controller for edit product by seller
export const editProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = parseInt(req.params.id);

    let sellerProducts = await Product.findOne({ sellerId });
    if (!sellerProducts) {
      return res.status(404).json({ message: "Seller has no products" });
    }

    const productIndex = sellerProducts.products.findIndex((p) => p.productId === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }
    sellerProducts.products[productIndex] = {
      ...sellerProducts.products[productIndex],
      productId,
      name: req.body.name || sellerProducts.products[productIndex].name,
      description: req.body.description || sellerProducts.products[productIndex].description,
      price: req.body.price || sellerProducts.products[productIndex].price,
      quantity: req.body.quantity || sellerProducts.products[productIndex].quantity,
      image: req.body.image || sellerProducts.products[productIndex].image,
    };

    await sellerProducts.save();
    res.json({ message: "Product updated successfully", product: sellerProducts.products[productIndex] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controller for fetching products by store id at customer end
export const getProductsByStore = async (req, res) => {
  try {
    const { id } = req.params; 

    const storeProducts = await Product.findOne({ sellerId: id });

    if (!storeProducts) {
      return res.status(404).json({ message: "No products found for this store" });
    }

    res.json({ products: storeProducts.products });
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

