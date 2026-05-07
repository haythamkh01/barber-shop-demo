import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Login({ setIsLoggedIn, setRole, isLoggedIn, role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://barber-shop-demo.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", data.role);

        setIsLoggedIn(true);
        setRole(data.role);

        setMessage("Login successful");

        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        role={role}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
      />

      <section className="section login-section">
        <div className="section-content">
          <div className="appointment-box">
            <h2>Admin Login</h2>

            <form className="appointment-form" onSubmit={handleLogin}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="submit-btn">
                Login
              </button>

              {message && <p style={{ marginTop: "12px" }}>{message}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}