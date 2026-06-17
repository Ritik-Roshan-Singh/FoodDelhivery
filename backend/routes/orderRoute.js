import express from "express";
import { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/auth.js";


const orderRouter  = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", adminMiddleware, listOrders);
orderRouter.post("/status", adminMiddleware, updateOrderStatus);

export default orderRouter;
