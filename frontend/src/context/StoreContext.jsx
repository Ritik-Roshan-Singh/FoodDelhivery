import axios from "axios";
import api from '../api/axiosConfig';
import { createContext, use, useEffect, useState } from "react";




export const StoreContext = createContext({
  //food_list: [],
});

const StoreContextProvider = (props) => {


  const [cartItems, setCartItems] = useState({});

  // Base URL for building image src. Use env var if available.
  const url =  "http://localhost:4000";
  const [token, setToken] = useState("");

  const [food_list, setFoodList] = useState([]);


  const addToCart =  async (itemId) => {
    // If user is authenticated (we have a token), persist cart to backend
    if (token) {
      (async () => {
        try {
          await api.post(
            "/api/cart/add",
            { itemId },
            { headers: { token } }
          );
          // optimistic local update
          setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        } catch (error) {
          console.error("addToCart API error:", error);
        }
      })();
    } else {
      // fallback to local-only cart for unauthenticated users
      setCartItems((prev) => {
        const current = prev?.[itemId] ?? 0;
        return { ...prev, [itemId]: current + 1 };
      });
      if (token) {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      }
    }
  };
  const removeFromCart = async(itemId) => {
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      (async () => {
        try {
          await api.post(
            "/api/cart/remove",
            { itemId },
            { headers: { token } }
          );
          setCartItems((prev) => {
            const next = { ...prev };
            next[itemId] = (next[itemId] || 1) - 1;
            if (next[itemId] <= 0) delete next[itemId];
            return next;
          });
        } catch (error) {
          console.error("removeFromCart API error:", error);
        }
      })();
    } else {
      setCartItems((prev) => {
        const current = prev?.[itemId] ?? 1;
        const nextCount = current - 1;
        const next = { ...prev };
        if (nextCount <= 0) {
          delete next[itemId];
        } else {
          next[itemId] = nextCount;
        }
        return next;
      });
    }
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += (itemInfo.price || 0) * cartItems[item];
        }
      }
    }
    return totalAmount;
  };
  const fetchFoodList = async () => {
    // Ensure there's a slash between base URL and path to form a valid URL
    // The backend returns an object: { success: true, data: [ ...foods ] }
    // axios.response.data will therefore be that object, so we need to
    // extract the `data` field from it (i.e. response.data.data) which is
    // the actual array of foods. If we set food_list to response.data
    // directly we'd get an object and `food_list.map` would throw.
    try {
      // Use centralized axios instance with baseURL
      const response = await axios.get(url + '/api/food/list');
      // Prefer the nested data array, fallback to an empty array if missing
      const foods = response?.data?.data ?? [];
      setFoodList(foods);
    } catch (error) {
      console.error("fetchFoodList error:", error);
      setFoodList([]);
    }
  }

  const loadCartItems = async (token) => {
    try {
      // axios.post(url, data, config) — pass empty data object when no body is needed
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      // Backend returns { success: true, data: cartData }
      const serverCart = response?.data?.data ?? {};
      // Debug log to aid troubleshooting in dev
      // console.debug('loadCartItems response', response?.data, serverCart);
      setCartItems(serverCart);
    } catch (error) {
      console.error("loadCartItems error:", error);
      setCartItems({});
    }

  }

  useEffect(() => {
     async function loadData() {
      await fetchFoodList();
      
    if(localStorage.getItem("token")){
      setToken(localStorage.getItem("token"))
      await loadCartItems(localStorage.getItem("token"));
    }
   
    }
    loadData();
  },[])

  // Persist local (unauthenticated) cart to localStorage so items survive refresh.
  useEffect(() => {
    // Only persist when there's no authenticated token — server-side cart takes precedence.
    if (!token) {
      try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems || {}));
      } catch (e) {
        console.warn("Failed to persist cart to localStorage:", e);
      }
    }
  }, [cartItems, token]);

  // On mount, if there's no token try to hydrate cart from localStorage so items are shown after refresh.
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      try {
        const raw = localStorage.getItem("cartItems");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") setCartItems(parsed);
        }
      } catch (e) {
        console.warn("Failed to read cart from localStorage:", e);
      }
    }
  }, []);

 



  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
