import axios from "axios";
import api from "../api/axiosConfig";
import { useEffect, useState, createContext } from "react";

// Create and export the context here (previously imported from a missing file)
const StoreContext = createContext(null);
export { StoreContext };

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const url = "https://fooddelhivery-backend.onrender.com";

  // Add item to cart (optimistic update, persist if authenticated)
  const addToCart = async (itemId) => {
    try {
      if (token) {
        await api.post("/api/cart/add", { itemId }, { headers: { token } });
      }
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
    } catch (error) {
      console.error("addToCart error:", error);
    }
  };

  // Remove item from cart (optimistic update, persist if authenticated)
  const removeFromCart = async (itemId) => {
    try {
      if (token) {
        await api.post("/api/cart/remove", { itemId }, { headers: { token } });
      }
      setCartItems((prev) => {
        const next = { ...prev };
        if (!next[itemId]) return next;
        next[itemId] -= 1;
        if (next[itemId] <= 0) delete next[itemId];
        return next;
      });
    } catch (error) {
      console.error("removeFromCart error:", error);
    }
  };

  // Calculate total amount for cart
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = food_list.find((p) => p._id === itemId);
      if (product) {
        totalAmount += (product.price || 0) * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(url + "/api/food/list");
      setFoodList(res?.data?.data || []);
    } catch (err) {
      console.error("fetchFoodList error:", err);
      setFoodList([]);
    }
  };

  // Load cart items from backend for authenticated users
  const loadCartItems = async (tk) => {
    try {
      const res = await axios.post(url + "/api/cart/get", {}, { headers: { token: tk } });
      setCartItems(res?.data?.data || {});
    } catch (err) {
      console.error("loadCartItems error:", err);
      setCartItems({});
    }
  };

  // Initial load: fetch foods and hydrate cart (server if token, otherwise localStorage)
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartItems(savedToken);
      } else {
        try {
          const localCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
          setCartItems(localCart);
        } catch (e) {
          console.warn("Failed to parse local cart:", e);
          setCartItems({});
        }
      }
    };
    loadData();
  }, []);

  // Persist local (unauthenticated) cart to localStorage
  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems || {}));
      } catch (e) {
        console.warn("Failed to persist cart to localStorage:", e);
      }
    }
  }, [cartItems, token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
