import { Router } from "express";
import { dashboard, users } from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
router.get("/dashboard", authenticate, authorize("ADMIN"), dashboard);
router.get("/users", authenticate, authorize("ADMIN"), users);
export default router;
