# ===== FRONTEND BUILD STAGE =====
FROM node:20-alpine AS frontend-build
WORKDIR /notes-taking-app
COPY notes-taking-app/package*.json ./
RUN npm ci
COPY notes-taking-app/ ./
RUN npm run build


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

# Copy frontend build into backend’s public folder
COPY --from=frontend-build /notes-taking-app/dist ./public

EXPOSE 5000
CMD ["node", "server.js"]
