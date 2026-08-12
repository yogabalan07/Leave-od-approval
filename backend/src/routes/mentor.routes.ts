import { Router } from "express";
import { mentorQueue, approveOD, approveLeave } from "../controllers/approval.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.get("/queue", authenticate, authorize("MENTOR"), mentorQueue);
router.patch("/od/:id", authenticate, authorize("MENTOR"), approveOD);
router.patch("/leave/:id", authenticate, authorize("MENTOR"), approveLeave);
export default router;
