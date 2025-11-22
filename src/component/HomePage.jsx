import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";

const HomePage = () => {
  return (
    <>
      {/* ===== Carousel Section ===== */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-toyeah="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#mainCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={saree1} className="d-block w-100" alt="Saree 1" />
            <div className="carousel-caption text-start">
              <h1>Festive Elegance</h1>
              <p>Explore our Jaipur-inspired festive collection.</p>
              <p>
                <a className="btn btn-lg btn-primary" href="#shop">
                  Shop Now
                </a>
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={saree2} className="d-block w-100" alt="Saree 2" />
            <div className="carousel-caption">
              <h1>Handcrafted Kurtis</h1>
              <p>Comfort and class woven together.</p>
              <p>
                <a className="btn btn-lg btn-primary" href="#shop">
                  Browse Collection
                </a>
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={saree3} className="d-block w-100" alt="Saree 3" />
            <div className="carousel-caption text-end">
              <h1>Exclusive Designs</h1>
              <p>Authentic fabrics from Surat and Ahmedabad.</p>
              <p>
                <a className="btn btn-lg btn-primary" href="#contact">
                  Contact Us
                </a>
              </p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      <div className="container marketing my-5 text-center">
        <div className="row">
          <div className="col-lg-4">
            <img
              src={saree1}
              className="bd-placeholder-img rounded-circle"
              width="140"
              height="140"
              alt="Festive Wear"
            />
            <h2 className="fw-normal mt-3">Festive Wear</h2>
            <p>Elegant sarees, perfect for Diwali and weddings.</p>
          </div>
          <div className="col-lg-4">
            <img
              src={saree2}
              className="bd-placeholder-img rounded-circle"
              width="140"
              height="140"
              alt="Daily Kurtis"
            />
            <h2 className="fw-normal mt-3">Daily Kurtis</h2>
            <p>Soft cotton kurtis for everyday comfort.</p>
          </div>
          <div className="col-lg-4">
            <img
              src={saree3}
              className="bd-placeholder-img rounded-circle"
              width="140"
              height="140"
              alt="Dupatta Sets"
            />
            <h2 className="fw-normal mt-3">Dupatta Sets</h2>
            <p>Vibrant combos to brighten your wardrobe.</p>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="py-4 bg-dark text-light text-center"></footer>
    </>
  );
};

export default HomePage;
