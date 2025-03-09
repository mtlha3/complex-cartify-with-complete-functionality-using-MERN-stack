import express from "express";
import {getUserOrders, placeOrder, getSellerOrders, updateOrderStatus} from "../controllers/orderController.js";
import {verifyToken} from  "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/place", verifyToken, placeOrder); 
router.get("/user", verifyToken, getUserOrders);
router.get('/seller', verifyToken, getSellerOrders);
router.put('/status/:orderId', verifyToken, updateOrderStatus);



export default router;

