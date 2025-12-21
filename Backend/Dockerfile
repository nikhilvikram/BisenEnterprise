# -----------------------------------------------------------
# 1. THE BASE IMAGE (The Foundation)
# We don't start from scratch (windows/linux). We start with a 
# pre-built image that already has Node.js installed.
# -----------------------------------------------------------
# "alpine" is a tiny, lightweight Linux version (5MB vs 1GB).
# PROS: Faster builds, smaller storage, less security risk.
FROM node:20-alpine

# -----------------------------------------------------------
# 2. THE WORKING DIRECTORY (The Folder)
# Create a folder named 'app' inside the container.
# All future commands will run inside this folder.
# WHY? Prevents us from cluttering the root directory.
# -----------------------------------------------------------
WORKDIR /app

# -----------------------------------------------------------
# 3. DEPENDENCY INSTALLATION (The Smart Layering)
# 🛑 CRITICAL INTERVIEW CONCEPT: "Layer Caching"
# We COPY only the package files first, NOT the source code.
# -----------------------------------------------------------
COPY package*.json ./

# -----------------------------------------------------------
# 4. INSTALL DEPENDENCIES
# We use 'npm ci' instead of 'npm install'.
# WHY? 'ci' (Clean Install) is strictly for production.
# It deletes node_modules and installs exact versions from package-lock.json.
# It is faster and deterministic (no surprises).
# -----------------------------------------------------------
RUN npm ci

# -----------------------------------------------------------
# 5. COPY SOURCE CODE (The Application)
# Now that dependencies are installed, we copy everything else.
# WHY SEPARATE STEPS?
# Docker caches steps. If you change a line in server.js, 
# Docker sees Step 3 hasn't changed, so it SKIPS 'npm ci' (Step 4)
# and only re-runs Step 5. This makes rebuilds instant!
# -----------------------------------------------------------
COPY . .

# -----------------------------------------------------------
# 6. DOCUMENTATION (The Port)
# This doesn't actually open the port. It just documents that
# this container *intends* to listen on port 5000.
# -----------------------------------------------------------
EXPOSE 5000

# -----------------------------------------------------------
# 7. STARTUP COMMAND (The Ignition)
# What happens when we push the "Power On" button?
# We start the server.
# -----------------------------------------------------------
CMD ["npm", "start"]