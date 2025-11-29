import { createContext, useState } from "react";

export const UserContext = createContext({
  user: null, // { name, email, phone }
  login: () => {},
  logout: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Nikhil Bisen",
    email: "nikhilbisen25@gmail.com",
    phone: "9767853662",
  });

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;