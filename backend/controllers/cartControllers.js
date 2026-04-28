import userModel from "../models/userModel.js";

// Add item to user's cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    if (!userId || !itemId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    await userModel.findByIdAndUpdate(userId, {
      $inc: { [`cartData.${itemId}`]: 1 }
    });

    res.json({ success: true, message: "Item added" });

  } catch (error) {
    console.error("AddToCart Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Remove item from user's cart (decrement or delete)
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        if (!cartData[itemId]) {
            return res.json({ success: false, message: "Item not in cart" });
        }

        cartData[itemId] = cartData[itemId] - 1;
        if (cartData[itemId] <= 0) delete cartData[itemId];

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error("removeFromCart error:", error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch user's cart items
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({ success: false, message: "User not found" });

        const cartData = userData.cartData || {};
        res.json({ success: true, data: cartData });
    } catch (error) {
        console.error("getCart error:", error);
        res.json({ success: false, message: "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, getCart };