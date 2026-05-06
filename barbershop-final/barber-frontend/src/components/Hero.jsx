export default function Hero() {
  return (
    <section id="hero" className="section hero">
      <div className="section-content">
        <div className="hero-text">
          <h1>Modern Cuts. Clean Style. Easy Booking.</h1>
          <p>
            Welcome to our barber shop. Book your appointment in seconds, choose
            your service, and get the exact time that fits your day.
          </p>

          <div className="hero-buttons">
            <a href="#appointment" className="primary-btn">
              Book Now
            </a>
            <a href="#prices" className="secondary-btn">
              View Prices
            </a>
          </div>
        </div>

        <div className="hero-card">
          <span className="mini-label">Premium Barber Experience</span>
          <h3>Sharp look, simple process</h3>
          <p>
            Fast booking, clear time slots, and a clean modern experience for
            every customer.
          </p>

          <div className="hero-stats">
            <div className="stat-box">
              <h4>3+</h4>
              <span>Services</span>
            </div>
            <div className="stat-box">
              <h4>Easy</h4>
              <span>Booking Flow</span>
            </div>
            <div className="stat-box">
              <h4>Fast</h4>
              <span>Appointment Setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}