import { Router } from "express";
import { uploadMiddleware } from "@/middlewares/upload.middleware.js";

const router = Router();

router.post("/", uploadMiddleware.array("files"), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: "Nenhum arquivo enviado" });
      return;
    }

    const urls = files.map((file) => `/uploads/${file.filename}`);
    
    res.status(200).json({
      success: true,
      data: { urls },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno ao processar upload" });
  }
});

export default router;
