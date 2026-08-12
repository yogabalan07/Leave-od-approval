import { Router } from "express";
import { uploadEvidence, listEvidence } from "../controllers/evidence.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();
router.post("/od/:id", authenticate, authorize("STUDENT"), upload.single("image"), uploadEvidence);
router.get("/od/:id", authenticate, listEvidence);
export default router;
