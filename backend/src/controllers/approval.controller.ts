import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function mentorQueue(req: Request, res: Response) {
  const [od, leave] = await Promise.all([
    prisma.oDApplication.findMany({
      where: { status: "MENTOR_PENDING" },
      include: { student: { select: { name: true, registerNo: true, email: true } } },
      orderBy: { createdAt: "asc" }
    }),
    prisma.leaveApplication.findMany({
      where: { status: "MENTOR_PENDING" },
      include: { student: { select: { name: true, registerNo: true, email: true } } },
      orderBy: { createdAt: "asc" }
    })
  ]);
  res.json({ success: true, od, leave });
}

export async function hodQueue(req: Request, res: Response) {
  const [od, leave] = await Promise.all([
    prisma.oDApplication.findMany({
      where: { status: "HOD_PENDING" },
      include: { student: { select: { name: true, registerNo: true, email: true } } },
      orderBy: { createdAt: "asc" }
    }),
    prisma.leaveApplication.findMany({
      where: { status: "HOD_PENDING" },
      include: { student: { select: { name: true, registerNo: true, email: true } } },
      orderBy: { createdAt: "asc" }
    })
  ]);
  res.json({ success: true, od, leave });
}

export async function approveOD(req: Request, res: Response) {
  const { action, remarks } = req.body;
  const app = await prisma.oDApplication.findUnique({ where: { id: req.params.id } });
  if (!app) return res.status(404).json({ success: false, message: "Application not found" });

  const isMentor = req.user!.role === "MENTOR";
  const isHod = req.user!.role === "HOD";

  if (isMentor && app.status !== "MENTOR_PENDING") return res.status(400).json({ success: false, message: "Not in mentor queue" });
  if (isHod && app.status !== "HOD_PENDING") return res.status(400).json({ success: false, message: "Not in HOD queue" });

  const rejected = action === "REJECTED";
  const nextStatus = rejected ? "REJECTED" : isMentor ? "HOD_PENDING" : "EVIDENCE_PENDING";

  const updated = await prisma.$transaction([
    prisma.oDApplication.update({ where: { id: app.id }, data: { status: nextStatus } }),
    prisma.approvalHistory.create({
      data: {
        applicationType: "OD",
        odApplicationId: app.id,
        approverId: req.user!.userId,
        action: rejected ? "REJECTED" : "APPROVED",
        remarks
      }
    }),
    prisma.notification.create({
      data: {
        userId: app.studentId,
        title: rejected ? "OD Rejected" : isMentor ? "OD Approved by Mentor" : "OD Approved by HOD",
        message: rejected ? (remarks || "Your OD application was rejected.") : isMentor ? "Your OD moved to HOD approval." : "Your OD is approved. Upload participation evidence after the event."
      }
    })
  ]);

  res.json({ success: true, data: updated[0] });
}

export async function approveLeave(req: Request, res: Response) {
  const { action, remarks } = req.body;
  const app = await prisma.leaveApplication.findUnique({ where: { id: req.params.id } });
  if (!app) return res.status(404).json({ success: false, message: "Leave not found" });

  const isMentor = req.user!.role === "MENTOR";
  const isHod = req.user!.role === "HOD";
  if (isMentor && app.status !== "MENTOR_PENDING") return res.status(400).json({ success: false, message: "Not in mentor queue" });
  if (isHod && app.status !== "HOD_PENDING") return res.status(400).json({ success: false, message: "Not in HOD queue" });

  const rejected = action === "REJECTED";
  const nextStatus = rejected ? "REJECTED" : isMentor ? "HOD_PENDING" : "APPROVED";

  const updated = await prisma.$transaction([
    prisma.leaveApplication.update({ where: { id: app.id }, data: { status: nextStatus } }),
    prisma.approvalHistory.create({
      data: {
        applicationType: "LEAVE",
        leaveApplicationId: app.id,
        approverId: req.user!.userId,
        action: rejected ? "REJECTED" : "APPROVED",
        remarks
      }
    }),
    prisma.notification.create({
      data: {
        userId: app.studentId,
        title: rejected ? "Leave Rejected" : "Leave Updated",
        message: rejected ? (remarks || "Your leave was rejected.") : isMentor ? "Your leave moved to HOD approval." : "Your leave has been approved."
      }
    })
  ]);

  res.json({ success: true, data: updated[0] });
}
