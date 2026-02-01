import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand & Description */}
          <div className="footer-column footer-brand">
            <h4 className="footer-logo">BisenEnterprise</h4>
            <p className="footer-desc">
              Premium clothing sourced directly from Surat, Jaipur & Ahmedabad.
              Quality you can trust, delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/HomePage">Home</Link>
              </li>
              <li>
                <Link to="/SareeList">Sarees</Link>
              </li>
              <li>
                <Link to="/Categories">Categories</Link>
              </li>
              <li>
                <Link to="/CreatePost">Create Post</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h5 className="footer-heading">Support</h5>
            <ul className="footer-links">
              <li>
                <Link to="#">FAQs</Link>
              </li>
              <li>
                <Link to="#">Shipping</Link>
              </li>
              <li>
                <Link to="#">Returns</Link>
              </li>
              <li>
                <Link to="/policy/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h5 className="footer-heading">Legal</h5>
            <ul className="footer-links">
              <li>
                <Link to="/policy/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/policy/terms-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/policy/refund-policy">Cancellation & Refund</Link>
              </li>
              <li>
                <Link to="/policy/shipping-policy">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-column footer-social-col">
            <h5 className="footer-heading">Follow Us</h5>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} BisenEnterprise. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
