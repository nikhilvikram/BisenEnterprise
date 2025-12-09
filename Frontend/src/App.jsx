import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Footer from "./component/Footer";
import Sidebar from "./component/Sidebar";
import CreatePost from "./component/CreatePost";
import PostList from "./component/PostList";
import { useContext, useEffect, useState } from "react";
import PostListProvider from "./store/post-list-store";
import HomePage from "./component/HomePage";
import SareeList from "./component/SareeList";
import Categories from "./component/Categories";
import TextileListProvider from "./store/textile-list-store";
import HeaderNavbar from "./component/HeaderNavbar";
import CartPage from "./component/CartPage";
import WishlistPage from "./component/WishlistPage";
import MobileBottomNav from "./component/MobileBottomNav";
import ScrollRestoration from "./component/ScrollRestoration";
import BackendProducts from "./component/BackendProducts";
import Login from "./component/Login";
import UserProvider from "./store/user-context";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import ProductList from "./component/SareeList";
import ProductDetail from "./component/ProductDetail";
import { ThemeProvider, ThemeContext } from "./store/theme-context";
import CartProvider from "./store/cart-context";
import AboutUs from "./component/AboutUs";
import UserProfile from "./component/UserProfile";
import KurtaList from "./component/KurtaList";
import CheckoutPage from "./component/CheckoutPage";
import { useDispatch } from "react-redux";
import { fetchWishlist } from "./store/wishlistSlice";
import { AuthProvider } from "./store/auth-context";
import { fetchCart } from "./store/cartSlice";
import MyOrdersPage from "./component/MyOrdersPage"; // Import
function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product");
  const { darkMode } = useContext(ThemeContext);
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);
  // ✅ LOAD INITIAL DATA
  useEffect(() => {
    // Only fetch if user is logged in
    if (localStorage.getItem("token")) {
      dispatch(fetchWishlist());
      dispatch(fetchCart()); // <--- Fetch cart from MongoDB
    }
  }, [dispatch]);
  return (
    <>
      <ScrollRestoration />
      <div className="app-container">
        <HeaderNavbar />
        <Sidebar />
        <div className="content" id="scrollArea">
          <Routes>
            {/* <Route path="/" element={<SareeList />} /> */}
            <Route path="/" element={<Navigate to="/HomePage" />} />
            <Route path="/Home" element={<PostList />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/SareeList" element={<SareeList />} />
            <Route path="/Categories" element={<Categories />} />
            <Route path="/Cart" element={<CartPage />} />
            <Route path="/Wishlist" element={<WishlistPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/BackendProducts" element={<BackendProducts />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/KurtaList" element={<KurtaList />} />
            <Route path="/Checkout" element={<CheckoutPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Orders" element={<h2>My Orders Page</h2>} />
            <Route path="/SavedAddresses" element={<h2>Saved Addresses</h2>} />
            <Route path="/Support" element={<AboutUs />} />
            <Route path="/EditProfile" element={<h2>Edit Profile Page</h2>} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
          </Routes>

          <MobileBottomNav />
          <Footer />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="page-wrapper">
      <Provider store={store}>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <ThemeProvider>
                <TextileListProvider>
                  <Router>
                    <PostListProvider>
                      <AppContent />
                    </PostListProvider>
                  </Router>
                </TextileListProvider>
              </ThemeProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </Provider>
    </div>
  );
}

export default App;
