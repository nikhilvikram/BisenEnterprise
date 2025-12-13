import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaBox, FaUsers, FaPlus, FaEdit, FaUserShield, FaCrown, 
  FaMoneyBillWave, FaBoxes, FaSave, FaExclamationTriangle 
} from "react-icons/fa";

const CRMPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("orders");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // 📦 New State for Products
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); 
  
  // Local state to track stock input changes before saving
  const [stockUpdates, setStockUpdates] = useState({}); 

  const token = localStorage.getItem("token");

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  // Fetch Data based on Tab
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "inventory") fetchInventory(); // 📦 Fetch on tab switch
  }, [activeTab]);

  // --- API CALLS ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://bisenenterprisebackend.onrender.com/api/auth/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) { alert("Failed to load users"); } finally { setLoading(false); }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Calls the NEW Admin-only route
      const res = await axios.get("https://bisenenterprisebackend.onrender.com/api/products/admin/all", {
        headers: { "x-auth-token": token },
      });
      setProducts(res.data);
    } catch (err) { alert("Failed to load inventory"); } finally { setLoading(false); }
  };

  const handleUpdateStock = async (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined) return; // No change made

    try {
      await axios.put(
        `https://bisenenterprisebackend.onrender.com/api/products/${productId}`,
        { stock: newStock },
        { headers: { "x-auth-token": token } }
      );
      alert("Stock Updated! 📈");
      fetchInventory(); // Refresh list
      setStockUpdates(prev => {
        const newState = { ...prev };
        delete newState[productId]; // Clear modified state
        return newState;
      });
    } catch (err) { alert("Update Failed"); }
  };

  // --- HANDLERS (Existing) ---
  const handlePromote = async (userId, newRole) => { /* ... existing code ... */ };
  const handleQtyChange = async (orderId, productId, newQty) => { /* ... existing code ... */ };
  const handleStatusChange = (orderId, newStatus) => { dispatch(updateOrderStatus({ orderId, status: newStatus })); };

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
          <button className={`nav-link ${activeTab === "inventory" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("inventory")}>
            <FaBoxes className="me-2" /> Inventory
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active fw-bold" : ""}`} onClick={() => setActiveTab("users")}>
            <FaUsers className="me-2" /> User Accounts
          </button>
        </li>
      </ul>

      {/* --- TAB 1: ORDERS (Existing) --- */}
      {activeTab === "orders" && (
        // ... (Keep your existing Order Table Code exactly as is)
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

      {/* --- TAB 2: INVENTORY (🆕 NEW) --- */}
      {activeTab === "inventory" && (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          {loading ? <p>Loading Inventory...</p> : (
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className={prod.stock === 0 ? "table-danger" : ""}>
                    <td>
                      <img 
                        src={prod.images?.[0] || prod.image} 
                        alt="prod" 
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }} 
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{prod.title}</div>
                      {prod.stock === 0 && <small className="text-danger fw-bold"><FaExclamationTriangle /> OUT OF STOCK</small>}
                    </td>
                    <td>₹{prod.price}</td>
                    
                    {/* STOCK INPUT */}
                    <td>
                      <input 
                        type="number" 
                        className="form-control form-control-sm"
                        style={{ width: "80px" }}
                        value={stockUpdates[prod._id] !== undefined ? stockUpdates[prod._id] : prod.stock}
                        onChange={(e) => setStockUpdates({ ...stockUpdates, [prod._id]: Number(e.target.value) })}
                      />
                    </td>

                    {/* SAVE BUTTON (Only shows when edited) */}
                    <td>
                      {stockUpdates[prod._id] !== undefined && stockUpdates[prod._id] !== prod.stock && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleUpdateStock(prod._id)}
                        >
                          <FaSave /> Save
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- TAB 3: USERS (Existing) --- */}
      {activeTab === "users" && (
         // ... (Keep your existing User Table Code exactly as is)
         <div className="table-responsive shadow-sm rounded bg-white p-3">
         {loading ? <p>Loading...</p> : (
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