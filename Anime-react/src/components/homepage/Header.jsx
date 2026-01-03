import { useEffect, useState } from "react";
import "./Header.css";

export function Header() {
  const [bg, setBg] = useState("");

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 6) + 1;
    setBg(`/images/bg${randomNum}.jpg`);
  }, []);

  return (
    <div
      className="header"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="hero-text">
        <h1>OtakuIndex</h1>
        <p>Find your next anime obsession</p>
      </div>
    </div>
  );
}
