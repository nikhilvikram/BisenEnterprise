import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top">
        <div className="footer-container">
          {/* ==== COLUMN 1 ==== */}
          <div className="footer-column">
            <h5 className="footer-title">BisenEnterprise</h5>
            <p className="footer-text">
              Premium clothing sourced directly from Surat, Jaipur & Ahmedabad.
              Quality you can trust, delivered to your doorstep.
            </p>
          </div>

          {/* ==== COLUMN 2 ==== */}
          <div className="footer-column">
            <h6 className="footer-subtitle">Quick Links</h6>
            <ul class="no-style">
              <li>
                <a href="/Home">Home</a>
              </li>
              <li>
                <a href="/SareeList">Sarees</a>
              </li>
              <li>
                <a href="/Categories">Kurtas</a>
              </li>
              <li>
                <a href="/CreatePost">Create Post</a>
              </li>
            </ul>
          </div>

          {/* ==== COLUMN 3 ==== */}
          <div className="footer-column">
            <h6 className="footer-subtitle">Support</h6>
            <ul class="no-style">
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* ==== COLUMN 4 ==== */}
          <div className="footer-column">
            <h6 className="footer-subtitle">Follow Us</h6>
            <div className="footer-social">
              <FaFacebook size={20} />
              <FaInstagram size={20} />
              <FaTwitter size={20} />
              <FaYoutube size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ==== COPYRIGHT BAR ==== */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} BisenEnterprise — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
