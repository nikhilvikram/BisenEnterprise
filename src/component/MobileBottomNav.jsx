import { NavLink } from "react-router-dom";
import { FaStore, FaList, FaCompass, FaTshirt, FaUser } from "react-icons/fa";

const MobileBottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <NavLink to="/HomePage">
        <FaStore size={20} />
        <span>Store</span>
      </NavLink>

      <NavLink to="/Home">
        <FaList size={20} />
        <span>Feed</span>
      </NavLink>

      <NavLink to="/SareeList">
        <FaCompass size={20} />
        <span>Explore</span>
      </NavLink>

      <NavLink to="/KurtaList">
        <FaTshirt size={20} />
        <span>Categories</span>
      </NavLink>

      <NavLink to="/Profile">
        <FaUser size={20} />
        <span>Account</span>
      </NavLink>
    </div>
  );
};

export default MobileBottomNav;
