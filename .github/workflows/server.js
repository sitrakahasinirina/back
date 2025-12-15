import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import docsRoutes from "./routes/docs.js";
import { chatWithAI } from "./controllers/chatController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/docs", docsRoutes);
app.post("/api/chat", chatWithAI);

// Test route
app.get("/", (req, res) => res.send("Backend OK"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
