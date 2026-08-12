import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function listNotifications(req: Request, res: Response) {
  const data = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 30
  });
  res.json({ success: true, data });
}

export async function markRead(req: Request, res: Response) {
  const data = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user!.userId },
    data: { isRead: true }
  });
  res.json({ success: true, data });
}
