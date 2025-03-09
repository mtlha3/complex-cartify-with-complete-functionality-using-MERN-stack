import express from "express";
import { addProduct,getSellerProducts, deleteProduct, editProduct,  getProductsByStore} from "../controllers/productController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addProduct);
router.get("/seller", verifyToken, getSellerProducts);
router.delete("/delete/:id", verifyToken, deleteProduct);
router.put("/edit/:id", verifyToken, editProduct);
router.get("/store/:id", getProductsByStore);


export default router;
