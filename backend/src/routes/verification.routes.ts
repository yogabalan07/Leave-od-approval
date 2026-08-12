import { Router } from "express";
import { queue, verify } from "../controllers/verification.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.get("/queue", authenticate, authorize("VERIFIER"), queue);
router.patch("/:id", authenticate, authorize("VERIFIER"), verify);
export default router;
