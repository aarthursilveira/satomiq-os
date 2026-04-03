import { body, query, param } from "express-validator";

export const createClientValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("type")
    .isIn(["PERSON", "BRAND", "COMPANY"])
    .withMessage("Tipo inválido. Use: PERSON, BRAND ou COMPANY"),

  body("status")
    .optional()
    .isIn(["LEAD", "PROSPECT", "ACTIVE", "PAUSED", "CHURNED", "ARCHIVED"])
    .withMessage("Status inválido"),

  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Email inválido"),

  body("phone")
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Telefone inválido"),

  body("whatsapp")
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("WhatsApp inválido"),

  body("contractValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Valor do contrato deve ser positivo"),

  body("paymentDay")
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage("Dia de pagamento deve ser entre 1 e 31"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags deve ser um array"),

  body("tags.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Cada tag deve ter entre 1 e 50 caracteres"),
];

export const updateClientValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),

  body("type")
    .optional()
    .isIn(["PERSON", "BRAND", "COMPANY"])
    .withMessage("Tipo inválido"),

  body("status")
    .optional()
    .isIn(["LEAD", "PROSPECT", "ACTIVE", "PAUSED", "CHURNED", "ARCHIVED"])
    .withMessage("Status inválido"),

  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Email inválido"),

  body("contractValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Valor do contrato deve ser positivo"),

  body("paymentDay")
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage("Dia de pagamento deve ser entre 1 e 31"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags deve ser um array"),
];

export const listClientsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Página deve ser um número positivo"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage("Limit deve ser entre 1 e 100"),

  query("status")
    .optional()
    .isIn(["LEAD", "PROSPECT", "ACTIVE", "PAUSED", "CHURNED", "ARCHIVED"])
    .withMessage("Status inválido"),

  query("type")
    .optional()
    .isIn(["PERSON", "BRAND", "COMPANY"])
    .withMessage("Tipo inválido"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order deve ser asc ou desc"),
];

export const clientIdValidator = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID do cliente é obrigatório"),
];
