import React from "react";
import { useParams } from "react-router-dom";
import "../styles/policies.css";

const Policies = () => {
  const { type } = useParams();

  const content = {
    "privacy-policy": {
      title: "Privacy Policy",
      text: "At Bisen Enterprise, we are committed to protecting your privacy. We collect basic information like name, email, and address purely for order processing. We do not share your data with third parties.",
    },
    "terms-conditions": {
      title: "Terms and Conditions",
      text: "By using our website, you agree to the following terms. All products are subject to availability. Prices are subject to change without notice. We reserve the right to cancel orders suspected of fraud.",
    },
    "refund-policy": {
      title: "Cancellation & Refunds",
      text: "Orders can be cancelled before shipment. Refunds are processed within 5-7 business days to the original payment method. Damaged items must be reported within 24 hours of delivery.",
    },
    "shipping-policy": {
      title: "Shipping Policy",
      text: "We ship all over India. Standard delivery takes 5-7 business days. Shipping is free for orders above ₹500. You will receive a tracking link via SMS/Email once dispatched.",
    },
    "contact-us": {
      title: "Contact Us",
      text: (
        <>
          <p>
            <strong>Bisen Enterprise</strong>
          </p>
          <p>
            Address: 123, Fashion Street, Nagpur, Maharashtra, India - 440001
          </p>
          <p>Email: nikhilbisen25@gmail.com</p>
          <p>Phone: +91-9767853662</p>
          <p>Operating Hours: Mon-Sat, 10 AM - 7 PM</p>
        </>
      ),
    },
  };

  const page = content[type];

  if (!page) return <div className="container mt-5">Page Not Found</div>;

  return (
    <div className="container mt-5 mb-5 policies-container">
      <h2 className="mb-4">{page.title}</h2>
      <div className="p-4 bg-light rounded shadow-sm border">
        {typeof page.text === "string" ? <p>{page.text}</p> : page.text}
      </div>
    </div>
  );
};

export default Policies;
