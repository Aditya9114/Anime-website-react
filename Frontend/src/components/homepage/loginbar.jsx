import "./loginbar.css";

export function LoginBar({ user }) {
  return (
    <>
      {user ? (
        <>
          <h3>{user.username}</h3>
          <button>Logout</button>
        </>
      ) : (
        <>
          <div className="bar">
            <button
              className="rectangle"
              onClick={() => console.log("Sign Up clicked")}
            >
              Sign Up
            </button>

            <button
              className="rectangle"
              onClick={() => console.log("Login clicked")}
            >
              Login
            </button>
          </div>
        </>
      )}
    </>
  );
}
