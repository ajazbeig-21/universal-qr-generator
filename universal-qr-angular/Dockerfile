# Stage 1: Build Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run server
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY backend ./backend
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 8080
CMD ["node", "backend/server.js"]
