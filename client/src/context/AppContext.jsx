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

  // ================= LOAD CREDIT =================
  const loadCreditData = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/credits`,
        {},
        {
          headers: { token },
        },
      );

      const data = response.data;

      if (data.success) {
        setCredit(data.credit);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ================= GENERATE IMAGE =================
  const generateImage = async (prompt) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: { token },
        },
      );

      const data = response.data;

      if (data.success) {
        setCredit(data.creditBalance);
        return data.resultImage;
      } else {
        toast.error(data.message);

        if (data.creditBalance <= 0) {
          return { redirect: "/buy" };
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
  };

  // ================= AUTO LOAD =================
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
