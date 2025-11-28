import { FaStore, FaList, FaCompass, FaTshirt, FaUser } from "react-icons/fa";
import { saveScrollFor } from "../utils/scrollStore";
import SaveNavLink from "./SaveNavLink";
const MobileBottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <SaveNavLink to="/HomePage">
        <FaStore size={20} />
        <span>Store</span>
      </SaveNavLink>
      <SaveNavLink to="/SareeList">
        <FaCompass size={20} />
        <span>Explore</span>
      </SaveNavLink>

      <SaveNavLink to="/Categories">
        <FaTshirt size={20} />
        <span>Categories</span>
      </SaveNavLink>
      {/* <SaveNavLink to="/AboutUs">
        <FaList size={20} />
        <span>About Us</span>
      </SaveNavLink> */}
      <SaveNavLink to="/UserProfile">
        <FaUser size={20} />
        <span>Account</span>
      </SaveNavLink>
    </div>
  );
};

export default MobileBottomNav;
