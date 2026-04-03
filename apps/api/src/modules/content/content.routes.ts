import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as contentController from "@/modules/content/content.controller.js";

const router = Router();

router.use(authenticate);

const CONTENT_TYPES = ["POST", "STORY", "REEL", "CAROUSEL", "VIDEO", "BLOG", "EMAIL_CAMPAIGN"];
const CONTENT_STATUSES = ["IDEA", "DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

const createContentValidator = [
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("type").isIn(CONTENT_TYPES).withMessage("Tipo inválido"),
  body("platform").isArray({ min: 1 }).withMessage("Plataforma é obrigatória"),
  body("status").optional().isIn(CONTENT_STATUSES),
  body("clientId").notEmpty().withMessage("Cliente é obrigatório"),
  body("scheduledAt").optional().isISO8601().withMessage("Data inválida"),
  body("mediaUrls").optional().isArray(),
];

const updateContentValidator = [
  body("title").optional().trim().notEmpty(),
  body("type").optional().isIn(CONTENT_TYPES),
  body("platform").optional().isArray({ min: 1 }),
  body("status").optional().isIn(CONTENT_STATUSES),
  body("scheduledAt").optional().isISO8601(),
  body("mediaUrls").optional().isArray(),
];

router.get("/", contentController.list);
router.post("/", createContentValidator, contentController.create);
router.get("/:id", contentController.getById);
router.patch("/:id", updateContentValidator, contentController.update);
router.delete("/:id", contentController.remove);

export default router;
