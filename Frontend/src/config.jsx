// export const API_BASE_URL = "https://bisenenterprisebackend.onrender.com";
// export const API_URL = "http://3.110.221.128:5000/api";

// ✅ CENTRALIZED CONFIGURATION
// If we are running "npm run dev", use Localhost.
// If we are running "npm run build" (Live), use AWS EC2.

export const API_URL = import.meta.env.MODE === "production"
  ? "http://3.110.221.128/api"   // ☁️ Your New AWS Server
  : "http://localhost:5000/api";      // 💻 Your Local Computer

// export const API_URL = "http://3.110.221.128:5000/api";
