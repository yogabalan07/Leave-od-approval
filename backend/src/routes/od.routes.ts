import { Router } from "express";
import { createOD, listMyOD, getOD } from "../controllers/od.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.post("/", authenticate, authorize("STUDENT"), createOD);
router.get("/my", authenticate, authorize("STUDENT"), listMyOD);
router.get("/:id", authenticate, getOD);
export default router;
