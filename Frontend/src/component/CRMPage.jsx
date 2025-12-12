import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaUsers, FaPlus, FaEdit, FaCheck } from "react-icons/fa";

const CRMPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("orders");
  const [editingOrder, setEditingOrder] = useState(null); // ID of order being edited
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // --- HANDLER: Update Item Qty ---
  const handleQtyChange = async (orderId, productId, newQty) => {
    try {
      const res = await axios.put(
        `https://bisenenterprisebackend.onrender.com/api/orders/${orderId}/item/${productId}`,
        { qty: newQty },
        { headers: { "x-auth-token": token } }
      );
      alert("Order Updated!");
      dispatch(fetchAllOrders()); // Refresh UI
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh" }}>
      {/* HEADER WITH ADD BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bisen Admin Portal 🛡️</h2>
        <button
          className="btn btn-success fw-bold"
          onClick={() => navigate("/admin/add-product")}
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaBox /> Order Management
          </button>
        </li>
        {/* User tab code remains same... */}
      </ul>

      {/* ORDER MANAGEMENT TAB */}
      {activeTab === "orders" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items (Manage)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <small>#{order._id.slice(-6)}</small>
                  </td>
                  <td>
                    <div className="fw-bold">
                      {order.userId?.name || "Guest"}
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      style={{ width: "130px" }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                  {/* ITEM MANAGEMENT */}
                  <td>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() =>
                        setEditingOrder(
                          editingOrder === order._id ? null : order._id
                        )
                      }
                    >
                      {editingOrder === order._id
                        ? "Close Items"
                        : `View ${order.products.length} Items`}{" "}
                      <FaEdit />
                    </button>

                    {/* EXPANDED VIEW */}
                    {editingOrder === order._id && (
                      <div className="mt-2 p-2 bg-light rounded border">
                        {order.products.map((item) => (
                          <div
                            key={item._id}
                            className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1"
                          >
                            <small>{item.title}</small>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-xs btn-danger"
                                style={{ padding: "0px 6px" }}
                                onClick={() =>
                                  handleQtyChange(
                                    order._id,
                                    item.productId,
                                    item.qty - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="fw-bold">{item.qty}</span>
                              <button
                                className="btn btn-xs btn-success"
                                style={{ padding: "0px 6px" }}
                                onClick={() =>
                                  handleQtyChange(
                                    order._id,
                                    item.productId,
                                    item.qty + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="fw-bold">₹{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CRMPage;
