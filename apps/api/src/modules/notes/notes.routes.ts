import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as notesController from "@/modules/notes/notes.controller.js";

const router = Router();

router.use(authenticate);

const createNoteValidator = [
  body("content").trim().notEmpty().withMessage("Conteúdo é obrigatório"),
  body("isPinned").optional().isBoolean(),
  body("clientId").optional().isString(),
  body("projectId").optional().isString(),
];

const updateNoteValidator = [
  body("content").optional().trim().notEmpty().withMessage("Conteúdo não pode ser vazio"),
  body("isPinned").optional().isBoolean(),
];

router.get("/", notesController.list);
router.post("/", createNoteValidator, notesController.create);
router.patch("/:id", [...[param("id").notEmpty()], ...updateNoteValidator], notesController.update);
router.delete("/:id", param("id").notEmpty(), notesController.remove);

export default router;
