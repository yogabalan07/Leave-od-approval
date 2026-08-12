import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function createLeave(req: Request, res: Response) {
  const { leaveType, fromDate, toDate, reason } = req.body;
  if (!leaveType || !fromDate || !toDate || !reason) {
    return res.status(400).json({ success: false, message: "All leave fields are required" });
  }
  const data = await prisma.leaveApplication.create({
    data: {
      applicationNumber: `LV-${Date.now()}`,
      studentId: req.user!.userId,
      leaveType,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      status: "MENTOR_PENDING"
    }
  });
  res.status(201).json({ success: true, data });
}

export async function listMyLeave(req: Request, res: Response) {
  const data = await prisma.leaveApplication.findMany({
    where: { studentId: req.user!.userId },
    include: { approvals: { include: { approver: { select: { name: true, role: true } } } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data });
}
