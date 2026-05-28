import axios from "axios";
import "./loginbar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; 

export function LoginBar({ user, setUser }) {
  const navigate = useNavigate();

  // 2️⃣ NEW: State to control the logout toast popup
  const [toast, setToast] = useState({ show: false, message: "" });

  return (
    <div className="login-bar-container">
      {/* 3️⃣ NEW: The Toast Popup UI */}
      {toast.show && (
        <div className="toast-popup">
          <span className="toast-icon">✓</span>
          <p>{toast.message}</p>
        </div>
      )}

      {user ? (
        <div className="bar">
          <span className="username">{user.username}</span>
          <button
            className="btn btn-logout"
            onClick={async () => {
              try {
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
                  {},
                  { withCredentials: true },
                );

                // 4️⃣ NEW: Show the toast and instantly remove the user from the UI
                setToast({ show: true, message: "Successfully logged out." });
                setUser(null);

                // 5️⃣ NEW: Hide the toast after 1.5 seconds
                setTimeout(() => {
                  setToast({ show: false, message: "" });
                }, 1500);
              } catch (err) {
                console.error("Logout failed", err);
                setToast({ show: true, message: "Logout failed. Try again." });
                setTimeout(() => setToast({ show: false, message: "" }), 2000);
              }
            }}
          >
            Logout
          </button>
          <button
            className="btn menu-btn"
            onClick={() => {
              axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/favourites/list`,
                { withCredentials: true },
              )
              .then((res)=>{
                console.log(res.data.data);
                 navigate("favourites")
              })
              .catch(async (err) => {
  if (err.response?.status === 401) {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/favourites/list`,
        { withCredentials: true }
      );
      console.log(res.data.data);
      navigate("favourites");

    } catch (refreshErr) {
      alert("Session expired. Please login again.");
      console.log(refreshErr)
    }
  } else {
    console.log(err);
    alert("Something went wrong");
  }
})
            }}
          >
            Favourites
          </button>
          <button
  className="btn menu-btn"
  onClick={async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/watchlist/list`,
        { withCredentials: true }
      );
      console.log(res.data.data);
      navigate("watchlist");

    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          // Retry original request
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/watchlist/list`,
            { withCredentials: true }
          );
          console.log(res.data.data);
          navigate("watchlist");

        } catch (refreshErr) {
          alert("Session expired. Please login again.");
          console.log(refreshErr)
        }
      } else {
        alert("Something went wrong");
      }
    }
  }}
>
            WatchList
          </button>
        </div>
      ) : (
        <div className="bar">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
