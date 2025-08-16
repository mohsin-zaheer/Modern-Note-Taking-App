# ===== BACKEND BUILD STAGE =====
FROM node:20-alpine AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
ENV NODE_ENV=production

# ===== FINAL RUNTIME IMAGE =====
FROM node:20-alpine
WORKDIR /app

# Copy backend (Express app)
COPY --from=backend-build /backend ./

# Expose 8080 (matches ECS ALB health checks)
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
