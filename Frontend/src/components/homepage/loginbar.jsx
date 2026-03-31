import "./loginbar.css";
import { useNavigate } from "react-router-dom";

export function LoginBar({ user }) {
  const navigate = useNavigate();

  return (
    <>
      {user ? (
        <>
        <div className="bar">
          <h3 id="white">{user.username}</h3>
          <button>Logout</button>
        </div>
          
        </>
      ) : (
        <div className="bar">
          <button
            className="rectangle"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

          <button
            className="rectangle"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      )}
    </>
  );
}