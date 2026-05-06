export default function Prices() {
  return (
    <section id="prices" className="section prices">
      <div className="section-content">
        <div className="prices-header">
          <h2>Services & Prices</h2>
          <p>
            Choose the service that suits you best. Clear pricing, clean cuts,
            and simple booking.
          </p>
        </div>

        <div className="price-list">
          <div className="price-card">
            <h3>Hair Cut</h3>
            <p>Professional haircut with a fresh and modern finish.</p>
            <div className="price">50₪</div>
          </div>

          <div className="price-card">
            <h3>Beard Trim</h3>
            <p>Clean beard shaping and trimming for a sharp look.</p>
            <div className="price">30₪</div>
          </div>

          <div className="price-card">
            <h3>Hair + Beard</h3>
            <p>Complete service for a full refresh in one appointment.</p>
            <div className="price">70₪</div>
          </div>
        </div>
      </div>
    </section>
  );
}