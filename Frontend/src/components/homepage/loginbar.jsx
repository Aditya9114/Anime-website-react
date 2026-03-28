import "./loginbar.css"

export function LoginBar() {
    return (
        <div className="bar">
            <button className="rectangle" onClick={() => console.log("Sign Up clicked")}>
                Sign Up
            </button>
            
            <button className="rectangle" onClick={() => console.log("Login clicked")}>
                Login
            </button>
        </div>
    );
}