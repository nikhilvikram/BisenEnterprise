import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";

const HomePage = () => {
  return (
    <>
      {/* ===== HERO CAROUSEL ===== */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={saree1} className="d-block w-100" alt="Saree 1" />
            <div className="carousel-caption custom-caption">
              <h1>Festive Elegance</h1>
              <p>Explore Jaipur-inspired festive sarees.</p>
              <a className="btn btn-primary btn-lg">Shop Sarees</a>
            </div>
          </div>

          <div className="carousel-item">
            <img src={saree2} className="d-block w-100" alt="Saree 2" />
            <div className="carousel-caption custom-caption">
              <h1>Handcrafted Kurtis</h1>
              <p>Comfort & elegance woven together.</p>
              <a className="btn btn-primary btn-lg">Browse Kurtis</a>
            </div>
          </div>

          <div className="carousel-item">
            <img src={saree3} className="d-block w-100" alt="Saree 3" />
            <div className="carousel-caption custom-caption">
              <h1>Exclusive Designer Sets</h1>
              <p>Authentic fabrics from Surat & Ahmedabad.</p>
              <a className="btn btn-primary btn-lg">Explore Designs</a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TRENDING CATEGORY ===== */}
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-4">Trending Categories</h2>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <img src={saree1} className="rounded-circle shadow category-img" />
            <h4 className="mt-3">Festive Sarees</h4>
            <p>Perfect for weddings & festivals.</p>
          </div>

          <div className="col-12 col-md-4">
            <img src={saree2} className="rounded-circle shadow category-img" />
            <h4 className="mt-3">Daily Wear Kurtis</h4>
            <p>Soft cotton & rayon kurtis.</p>
          </div>

          <div className="col-12 col-md-4">
            <img src={saree3} className="rounded-circle shadow category-img" />
            <h4 className="mt-3">Dupatta Sets</h4>
            <p>Vibrant combos for your wardrobe.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
