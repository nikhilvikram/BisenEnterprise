import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/orderSlice";
import { FaBox, FaCheck, FaTruck, FaClock } from "react-icons/fa";

const CRMPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered": return "bg-success";
      case "Shipped": return "bg-primary";
      case "Cancelled": return "bg-danger";
      default: return "bg-warning text-dark"; // Processing
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bisen CRM Panel 🛡️</h2>
        <span className="badge bg-dark fs-6">{orders.length} Total Orders</span>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle" style={{ background: "white" }}>
          <thead className="bg-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><small className="text-muted">#{order._id.slice(-6)}</small></td>
                <td>
                  <div className="fw-bold">{order.userId?.name || "Guest"}</div>
                  <small className="text-muted">{order.userId?.email}</small>
                </td>
                <td>
                  {order.products?.length || 0} Items
                  {/* Tooltip or expand logic can go here */}
                </td>
                <td className="fw-bold">₹{order.amount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ width: "130px", borderColor: "#ddd" }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMPage;