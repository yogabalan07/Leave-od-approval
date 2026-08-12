import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function createOD(req: Request, res: Response) {
  const { eventName, eventType, eventLocation, fromDate, toDate, reason, eventLatitude, eventLongitude } = req.body;
  if (!eventName || !eventType || !eventLocation || !fromDate || !toDate || !reason) {
    return res.status(400).json({ success: false, message: "All OD fields are required" });
  }

  const application = await prisma.oDApplication.create({
    data: {
      applicationNumber: `OD-${Date.now()}`,
      studentId: req.user!.userId,
      eventName, eventType, eventLocation,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      eventLatitude: eventLatitude == null ? null : Number(eventLatitude),
      eventLongitude: eventLongitude == null ? null : Number(eventLongitude),
      status: "MENTOR_PENDING"
    }
  });

  res.status(201).json({ success: true, data: application });
}

export async function listMyOD(req: Request, res: Response) {
  const data = await prisma.oDApplication.findMany({
    where: { studentId: req.user!.userId },
    include: { approvals: { include: { approver: { select: { name: true, role: true } } } }, evidence: true, verification: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data });
}

export async function getOD(req: Request, res: Response) {
  const data = await prisma.oDApplication.findUnique({
    where: { id: req.params.id },
    include: {
      student: { select: { id: true, name: true, email: true, registerNo: true } },
      approvals: { include: { approver: { select: { name: true, role: true } } }, orderBy: { createdAt: "asc" } },
      evidence: true,
      verification: { include: { verifier: { select: { name: true } } } }
    }
  });
  if (!data) return res.status(404).json({ success: false, message: "OD not found" });
  res.json({ success: true, data });
}
