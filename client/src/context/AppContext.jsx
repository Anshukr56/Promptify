import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Load user + credit
  const loadCreditData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credit);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // 🔹 Generate image
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: { token },
        },
      );

      if (data.success) {
        await loadCreditData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        await loadCreditData();

        // ✅ return redirect instead of navigating here
        if (data.creditBalance === 0) {
          return { redirect: "/buy" };
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
  };

  // 🔹 Auto load when token changes
  useEffect(() => {
    if (token) {
      loadCreditData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditData,
    logout,
    generateImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
