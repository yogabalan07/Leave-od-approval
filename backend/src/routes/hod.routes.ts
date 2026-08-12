import { Router } from "express";
import { hodQueue, approveOD, approveLeave } from "../controllers/approval.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.get("/queue", authenticate, authorize("HOD"), hodQueue);
router.patch("/od/:id", authenticate, authorize("HOD"), approveOD);
router.patch("/leave/:id", authenticate, authorize("HOD"), approveLeave);
export default router;
