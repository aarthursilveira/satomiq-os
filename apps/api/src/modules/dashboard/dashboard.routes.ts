import { Router } from "express";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as dashboardController from "@/modules/dashboard/dashboard.controller.js";

const router = Router();

router.use(authenticate);

router.get("/stats", dashboardController.getStats);

export default router;
