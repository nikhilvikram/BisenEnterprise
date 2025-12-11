import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/orderSlice";
import axios from "axios";
import { FaBox, FaUsers, FaSearch, FaUserShield } from "react-icons/fa";

const CRMPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("orders");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch Orders on Mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Fetch Users when switching to 'users' tab
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(
        "https://bisenenterprisebackend.onrender.com/api/auth/users",
        {
          headers: { "x-auth-token": token },
        }
      );
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
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
      fetchUsers(); // Refresh list
    } catch (err) {
      alert("Update Failed");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bisen Admin Portal 🛡️</h2>
      </div>

      {/* TABS HEADER */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "orders" ? "active fw-bold" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <FaBox className="me-2" /> Order Management
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "users" ? "active fw-bold" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="me-2" /> User Accounts
          </button>
        </li>
      </ul>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <small className="text-muted">#{order._id.slice(-6)}</small>
                  </td>
                  <td>
                    <div className="fw-bold">
                      {order.userId?.name || "Guest"}
                    </div>
                    <small className="text-muted">{order.userId?.email}</small>
                  </td>
                  <td className="fw-bold">
                    ₹{order.amount || order.totalAmount}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Delivered"
                          ? "bg-success"
                          : order.status === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      style={{ width: "140px" }}
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
      )}

      {/* TAB CONTENT: USERS */}
      {activeTab === "users" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          {loadingUsers ? (
            <p>Loading Users...</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Promote To</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === "admin" ? (
                        <span className="badge bg-primary">
                          <FaUserShield /> Admin
                        </span>
                      ) : (
                        <span className="badge bg-secondary">User</span>
                      )}
                    </td>
                    <td>
                      {/* Only allow changing if not yourself ideally, but simpler for now */}
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          disabled={user.role === "admin"}
                          onClick={() => handlePromote(user._id, "admin")}
                        >
                          Make Admin
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          disabled={user.role === "user"}
                          onClick={() => handlePromote(user._id, "user")}
                        >
                          Demote
                        </button>
                      </div>
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
