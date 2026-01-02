import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// ---- CORS CONFIG ----
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatify-app-omega.vercel.app",
];

app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // Postman, same-origin

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(cookieParser());

// ---- ROUTES ----
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---- STATIC FILES IN PRODUCTION ----
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ---- START SERVER ----
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});

