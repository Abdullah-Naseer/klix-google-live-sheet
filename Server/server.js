
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/sheets", sheetRoutes);

app.use("/api/users", userRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Call Center Dashboard API is running!"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
