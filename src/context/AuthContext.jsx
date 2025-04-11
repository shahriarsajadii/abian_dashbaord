import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const base_url = "http://abian.liara.run";
 
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
       
        try {
          const response = await axios.get(`${base_url}/api/users/profile/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            
          }
        );
          setUser(response.data);
          console.log(accessToken)
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          if (error.response?.status === 401) {
            navigate("/signin");
          }
          
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  
  const login = async (credentials) => {
    console.log(credentials)
    try {
      const response = await axios.post(
        `${base_url}/api/users/token/`,
        credentials
      );
      
      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));
     
      setUser(user);
      toast.success(`خوش آمدید ${user.username}!`);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("نام کاربری یا رمز عبور اشتباه است!");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
    if (user) {
      toast.success(`${user.username} از حساب کاربری خارج شدید!`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
