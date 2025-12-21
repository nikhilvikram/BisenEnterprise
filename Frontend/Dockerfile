# Frontend/Dockerfile

# 1. Base Image
FROM node:20-alpine

# 2. Working Directory
WORKDIR /app

# 3. Copy Dependencies first (Layer Caching)
COPY package*.json ./

# 4. Install Dependencies
RUN npm install

# 5. Copy the rest of the code
COPY . .

# 6. Expose the Port (Vite usually uses 5173, React defaults to 3000)
# Check your vite.config.js or package.json to be sure!
EXPOSE 5173

# 7. Start the App
# 🛑 CRITICAL INTERVIEW KNOWLEDGE:
# By default, Vite runs on "localhost" (127.0.0.1) inside the container.
# Docker blocks this. We MUST add "--host" to let the outside world in.
CMD ["npm", "run", "dev", "--", "--host"]