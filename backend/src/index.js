import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignsRouter from "./routes/campaigns.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/campaigns", campaignsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
