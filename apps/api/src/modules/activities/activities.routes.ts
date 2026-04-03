import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as activitiesController from "@/modules/activities/activities.controller.js";

const router = Router();

router.use(authenticate);

const createActivityValidator = [
  body("type").notEmpty().withMessage("Tipo é obrigatório"),
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("clientId").notEmpty().withMessage("Cliente é obrigatório"),
];

router.get("/", activitiesController.list);
router.post("/", createActivityValidator, activitiesController.create);

export default router;
