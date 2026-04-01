import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login({ isLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 1️⃣ NEW: State to control our custom popup
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // 🔹 LOGIN API
        const res = await axios.post(
          "http://localhost:8000/api/v1/auth/login",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
        );

        console.log("Login Success:", res.data);

        // 2️⃣ NEW: Extract the username from the JSON response
        const username = res.data.data.user.username;
        
        // 3️⃣ NEW: Show the popup
        setToast({ show: true, message: `Welcome back, ${username}!` });

        // 4️⃣ NEW: Delay the redirect by 1.5 seconds so they can read the popup
        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        // 🔹 REGISTER API
        const res = await axios.post(
          "http://localhost:8000/api/v1/auth/register",
          formData
        );

        console.log("Register Success:", res.data);
        
        // Show success popup for registration too
        setToast({ show: true, message: "Registration successful! Please login." });
        
        setTimeout(() => {
          setToast({ show: false, message: "" }); // Hide popup
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      // Optional: You could also use the toast here to show the error message!
      setToast({ show: true, message: err.response?.data?.message || "Something went wrong." });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    }
  };

  return (
    <div className="container">
      {/* 5️⃣ NEW: The actual popup UI, conditionally rendered */}
      {toast.show && (
        <div className="toast-popup">
          <span className="toast-icon">✓</span>
          <p>{toast.message}</p>
        </div>
      )}

      <div className="form-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          onClick={() => navigate(isLogin ? "/register" : "/login")}
          className="toggle"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}