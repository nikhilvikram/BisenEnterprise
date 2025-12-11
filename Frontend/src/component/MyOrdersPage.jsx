import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.orders);
  const user = localStorage.getItem("user"); // Simple check

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Protect the route
    } else {
      dispatch(fetchOrders());
    }
  }, [dispatch, user, navigate]);

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-success";
      case "Cancelled":
        return "text-danger";
      default:
        return "text-warning"; // Processing/Shipped
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <h3>Loading your orders...</h3>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center text-danger">
        <h3>Error: {error}</h3>
      </div>
    );

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">My Orders 📦</h2>

      {orders.length === 0 ? (
        <div className="text-center p-5 rounded">
          <h4>You haven't placed any orders yet.</h4>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/SareeList")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="card mb-4 shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Order ID: {order._id}</small>
                  <div className="fw-bold">{formatDate(order.createdAt)}</div>
                </div>
                <div className={`fw-bold ${getStatusColor(order.status)}`}>
                  {order.status || "Processing"}
                </div>
              </div>

              <div className="card-body">
                {order.products &&
                  order.products.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center mb-3 pb-3 border-bottom"
                    >
                      {/* Assuming item.product has image/title populated. 
                        If backend stores minimal data, adjust fields */}
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.title}
                        style={{
                          width: "60px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{item.title}</h6>
                        <small className="text-muted">
                          Qty: {item.qty} x ₹{item.price}
                        </small>
                      </div>
                      <div className="fw-bold">₹{item.qty * item.price}</div>
                    </div>
                  ))}

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Payment: {order.paymentMethod || "Cash on Delivery"}
                  </div>
                  <h5 className="mb-0">Total: ₹{order.amount}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
