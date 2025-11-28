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
function AppContent() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product");
  const { darkMode } = useContext(ThemeContext);
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);
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
          </Routes>
          <Footer />
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="page-wrapper">
      <Provider store={store}>
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
      </Provider>
    </div>
  );
}

export default App;
