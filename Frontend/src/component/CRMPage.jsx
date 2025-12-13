import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaUsers, FaPlus, FaEdit, FaUserShield, FaCrown, FaMoneyBillWave } from "react-icons/fa";

const CRMPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("orders");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); 
  const token = localStorage.getItem("token");

  // Fetch Orders on Mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Fetch Users when switching tabs
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("https://bisenenterprisebackend.onrender.com/api/auth/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) { alert("Failed to load users"); } finally { setLoadingUsers(false); }
  };

  const handlePromote = async (userId, newRole) => {
    if (!window.confirm(`Promote user to ${newRole}?`)) return;
    try {
      await axios.put(
        `https://bisenenterprisebackend.onrender.com/api/auth/promote/${userId}`,
        { role: newRole },
        { headers: { "x-auth-token": token } }
      );
      alert("User Updated!");
      fetchUsers();
    } catch (err) { alert("Update Failed"); }
  };

  const handleQtyChange = async (orderId, productId, newQty) => {
    try {
      await axios.put(
        `https://bisenenterprisebackend.onrender.com/api/orders/${orderId}/item/${productId}`,
        { qty: newQty },
        { headers: { "x-auth-token": token } }
      );
      alert("Order Updated!");
      dispatch(fetchAllOrders());
    } catch (err) { alert("Failed to update quantity"); }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bisen Admin Portal 🛡️</h2>
        <button className="btn btn-success fw-bold" onClick={() => navigate("/admin/add-product")}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "orders" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("orders")}>
            <FaBox className="me-2" /> Order Management
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("users")}>
            <FaUsers className="me-2" /> User Accounts
          </button>
        </li>
      </ul>

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Details</th>
                <th>Address</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><small>#{order._id.slice(-6)}</small></td>
                  <td>
                    <div className="fw-bold">{order.userId?.name || "Guest"}</div>
                    <small className="text-muted">{order.products.length} Items • ₹{order.amount}</small>
                  </td>
                  
                  {/* 🆕 SAFE ADDRESS DISPLAY */}
                  <td style={{ maxWidth: "200px", fontSize: "0.9rem" }}>
                    {order.address ? (
                      <>
                        <div>{order.address.line1 || order.address.street}</div>
                        <div>{order.address.city} - {order.address.zip || order.address.pincode}</div>
                      </>
                    ) : <span className="text-muted">No Address</span>}
                  </td>

                  {/* 🆕 PAYMENT METHOD BADGE */}
                  <td>
                    {order.paymentMethod === "ONLINE" ? (
                      <span className="badge bg-success">
                        <FaCrown className="me-1"/> PAID (Online)
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        <FaMoneyBillWave className="me-1"/> COD
                      </span>
                    )}
                    {order.paymentId && <div style={{fontSize: "0.7rem"}} className="text-muted mt-1">ID: {order.paymentId.slice(-8)}...</div>}
                  </td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ width: "130px" }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <button 
                      className="btn btn-sm btn-outline-dark" 
                      onClick={() => setEditingOrder(editingOrder === order._id ? null : order._id)}
                    >
                      {editingOrder === order._id ? "Close" : "Edit Qty"} <FaEdit />
                    </button>
                    {editingOrder === order._id && (
                      <div className="mt-2 p-2 bg-light rounded border position-absolute bg-white shadow" style={{zIndex: 10, width: "300px", right: "50px"}}>
                        {order.products.map((item) => (
                          <div key={item._id} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
                            <small>{item.title}</small>
                            <div className="d-flex align-items-center gap-2">
                              <button className="btn btn-xs btn-danger p-0 px-2" onClick={() => handleQtyChange(order._id, item.productId, item.qty - 1)}>-</button>
                              <span className="fw-bold">{item.qty}</span>
                              <button className="btn btn-xs btn-success p-0 px-2" onClick={() => handleQtyChange(order._id, item.productId, item.qty + 1)}>+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          {loadingUsers ? <p>Loading...</p> : (
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "superadmin" ? (
                        <span className="badge bg-warning text-dark"><FaCrown /> Super Admin</span>
                      ) : user.role === "admin" ? (
                        <span className="badge bg-primary"><FaUserShield /> Admin</span>
                      ) : (
                        <span className="badge bg-secondary">User</span>
                      )}
                    </td>
                    <td>
                      {user.role === "superadmin" ? (
                        <span className="text-muted small fst-italic">Master</span>
                      ) : (
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" disabled={user.role === "admin"} onClick={() => handlePromote(user._id, "admin")}>Make Admin</button>
                          <button className="btn btn-outline-secondary" disabled={user.role === "user"} onClick={() => handlePromote(user._id, "user")}>Demote</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default CRMPage;