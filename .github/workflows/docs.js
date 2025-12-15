import express from "express";
import multer from "multer";
import { uploadDocument, getResult } from "../controllers/docsController.js";

const router = express.Router();

// Dossier pour stocker les fichiers
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("document"), uploadDocument);
router.get("/result/:id", getResult);

export default router;
