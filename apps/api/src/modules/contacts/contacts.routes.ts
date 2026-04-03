import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/modules/auth/auth.middleware.js";
import * as contactsController from "@/modules/contacts/contacts.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

const createContactValidator = [
  body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("isPrimary").optional().isBoolean(),
];

const updateContactValidator = [
  body("name").optional().trim().notEmpty(),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("isPrimary").optional().isBoolean(),
];

// These routes are mounted under /clients/:clientId/contacts
router.get("/", contactsController.listByClient);
router.post("/", createContactValidator, contactsController.create);
router.patch("/:id", updateContactValidator, contactsController.update);
router.delete("/:id", contactsController.remove);

export default router;
