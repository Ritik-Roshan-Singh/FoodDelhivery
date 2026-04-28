import express from "express";
// Correct controller filename: controllers folder contains `cartControllers.js`
import { addToCart, getCart, removeFromCart } from "../controllers/cartControllers.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();



//end point

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;