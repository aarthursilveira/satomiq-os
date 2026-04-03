import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as tasksController from "@/modules/tasks/tasks.controller.js";

const router = Router();

router.use(authenticate);

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("dueDate").optional().isISO8601().withMessage("Data inválida"),
];

const updateTaskValidator = [
  body("title").optional().trim().notEmpty().withMessage("Título não pode ser vazio"),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "CANCELLED"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("dueDate").optional().isISO8601().withMessage("Data inválida"),
];

router.get("/", tasksController.list);
router.post("/", createTaskValidator, tasksController.create);
router.get("/:id", tasksController.getById);
router.patch("/:id", updateTaskValidator, tasksController.update);
router.delete("/:id", tasksController.remove);

export default router;
