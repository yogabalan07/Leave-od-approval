import { Router } from "express";
import { listNotifications, markRead } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.get("/", authenticate, listNotifications);
router.patch("/:id/read", authenticate, markRead);
export default router;
