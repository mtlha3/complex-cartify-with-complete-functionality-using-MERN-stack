import express from "express";
import { addToCart, getUserCart, deleteFromCart, incrementQuantity, decrementQuantity} from "../controllers/cartController.js";
import {verifyToken} from  "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/add", verifyToken ,addToCart);
router.get("/cart", verifyToken, getUserCart);
router.delete("/remove", verifyToken, deleteFromCart);
router.put("/increment", verifyToken, incrementQuantity); 
router.put("/decrement", verifyToken, decrementQuantity); 


export default router;

