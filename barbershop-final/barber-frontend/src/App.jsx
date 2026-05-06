import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Prices from "./components/Prices";
import AppointmentForm from "./components/AppointmentForm";
import Footer from "./components/Footer";
import AppointmentsList from "./components/AppointmentList";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Gallery from "./components/Gallery";
import AppointmentReminder from "./components/AppointmentReminder";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="page">
              <Navbar
                setIsLoggedIn={setIsLoggedIn}
                setRole={setRole}
              />
              <AppointmentReminder/>
              <Hero />
              <Gallery />
              <Prices />
              <AppointmentForm />
              <Footer />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setRole={setRole}
              isLoggedIn={isLoggedIn}
              role={role}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppointmentsList
                setIsLoggedIn={setIsLoggedIn}
                setRole={setRole}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;