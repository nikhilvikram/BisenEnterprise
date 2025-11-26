// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   base: "/BisenEnterprise/",   // IMPORTANT!
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Automatically use correct base:
// - "/" on localhost
// - "/BisenEnterprise/" on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production"
    ? "/BisenEnterprise/"
    : "/",
});

