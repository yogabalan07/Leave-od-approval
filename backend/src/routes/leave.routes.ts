import { Router } from "express";
import { createLeave, listMyLeave } from "../controllers/leave.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.post("/", authenticate, authorize("STUDENT"), createLeave);
router.get("/my", authenticate, authorize("STUDENT"), listMyLeave);
export default router;
