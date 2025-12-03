import express from "express";
import { authenticate } from "../middleware/auth.js";
import { login, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
