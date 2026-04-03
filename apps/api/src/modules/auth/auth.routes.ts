import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "@/modules/auth/auth.controller.js";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "@/modules/auth/auth.validator.js";
import { config } from "@/config/env.js";

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: 10,
  message: { success: false, error: "Muitas tentativas. Tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authRateLimiter, registerValidator, authController.register);
router.post("/login", authRateLimiter, loginValidator, authController.login);
router.post("/refresh", authRateLimiter, refreshTokenValidator, authController.refresh);
router.get("/profile", authenticate, authController.profile);

export default router;
