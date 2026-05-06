import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ setIsLoggedIn, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    if (setIsLoggedIn) setIsLoggedIn(false);
    if (setRole) setRole("");

    navigate("/login");
  };

  return (
    <nav className="section navbar">
      <div className="section-content">
        <h2>Barber Shop</h2>

        <div className="nav-links">
          {isHome && (
            <>
              <a href="#hero">Home</a>
              <a href="#prices">Prices</a>
              <a href="#appointment">Book</a>
              <a href="#footer">Contact</a>
            </>
          )}

          {!isHome && <Link to="/">Home</Link>}

          {isLoggedIn && role === "ADMIN" && (
            <Link to="/admin">Dashboard</Link>
          )}

          {!isLoggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
           <button
  onClick={handleLogout}
  className="nav-logout-btn"
>
  Logout
</button>
          )}
        </div>
      </div>
    </nav>
  );
}