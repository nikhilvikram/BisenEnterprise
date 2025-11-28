import React from "react";
import aboutus from "../assets/aboutus.png";
export default function AboutUs() {
  return (
    <section className="bisen-about-section">
      <div className="bisen-about-container">
        {/* LEFT — IMAGE */}
        <div className="bisen-about-image-box">
          <img
            src={aboutus}
            alt="Bhagyashri Bisen sewing in her workshop"
            className="bisen-about-image"
          />
        </div>

        {/* RIGHT — TEXT */}
        <div className="bisen-about-content">
          <h2 className="bisen-about-title">Our Story</h2>

          <p className="bisen-about-para">
            <strong>Bhagyashri Bisen</strong> began her journey as a tailor more
            than fifteen years ago, stitching clothes with precision, patience,
            and love. What started as a simple sewing machine on a small table
            slowly transformed into a dream that would grow with every thread.
          </p>

          <p className="bisen-about-para">
            Five years ago, we founded <strong>Bisen Enterprise</strong> — a
            family-run textile brand bringing premium sarees, kurtas, and
            handcrafted clothing sourced directly from Surat, Ahmedabad, and
            Jaipur. Every product passes through the same care, passion, and
            dedication that my mother poured into her very first stitch.
          </p>

          <p className="bisen-about-para">
            Today, we are proud to share our collection with customers across
            India — blending tradition with style, and authenticity with trust.
            Your support keeps our dream alive.
          </p>

          <p className="bisen-about-sign">
            — From our family to yours, with love.
          </p>
        </div>
      </div>
    </section>
  );
}
