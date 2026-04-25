import React from "react";
import "./MyOrders.css";
import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets.js";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      setData(response.data.data || []);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // ✅ Latest order
  const order =
    data.length > 0
      ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {order && (
          <div className="my-orders-order">

            {/* Image */}
            <img src={assets.parcel_icon} alt="" />

            {/* Items */}
            <p className="items">
              {Array.isArray(order.items)
                ? order.items
                    .map((item) => `${item.name} x${item.quantity}`)
                    .join(", ")
                : "No items"}
            </p>

            {/* Amount */}
            <p className="amount">${order.amount || 0}</p>

            {/* Count */}
            <p className="count">
              Items: {order.items?.length || 0}
            </p>

            {/* Status */}
            <p className="status">
              ● {order.status}
            </p>

            {/* Button */}
            <button className="track-btn">
              Track Order
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;