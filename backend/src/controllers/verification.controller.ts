import { Request, Response } from "express";
import { prisma } from "../config/database";
import { distanceKm } from "../utils/distance";

export async function queue(req: Request, res: Response) {
  const data = await prisma.oDApplication.findMany({
    where: { status: "VERIFICATION_PENDING" },
    include: {
      student: { select: { name: true, registerNo: true, email: true } },
      evidence: true
    },
    orderBy: { createdAt: "asc" }
  });
  res.json({ success: true, data });
}

export async function verify(req: Request, res: Response) {
  const { status, remarks } = req.body;
  const app = await prisma.oDApplication.findUnique({
    where: { id: req.params.id },
    include: { evidence: true }
  });
  if (!app) return res.status(404).json({ success: false, message: "OD not found" });

  const evidence = app.evidence[0];
  if (!evidence) return res.status(400).json({ success: false, message: "No evidence uploaded" });

  let distance: number | null = null;
  if (app.eventLatitude != null && app.eventLongitude != null) {
    distance = distanceKm(app.eventLatitude, app.eventLongitude, evidence.latitude, evidence.longitude);
  }

  const verification = await prisma.verification.upsert({
    where: { odApplicationId: app.id },
    create: {
      odApplicationId: app.id,
      verifierId: req.user!.userId,
      status,
      distanceFromEvent: distance,
      remarks,
      verifiedAt: status === "VERIFIED" ? new Date() : null
    },
    update: {
      verifierId: req.user!.userId,
      status,
      distanceFromEvent: distance,
      remarks,
      verifiedAt: status === "VERIFIED" ? new Date() : null
    }
  });

  await prisma.oDApplication.update({
    where: { id: app.id },
    data: { status: status === "VERIFIED" ? "VERIFIED" : status === "REJECTED" ? "REJECTED" : "VERIFICATION_PENDING" }
  });

  await prisma.notification.create({
    data: {
      userId: app.studentId,
      title: status === "VERIFIED" ? "Participation Verified" : "Evidence Review Updated",
      message: status === "VERIFIED" ? "Your participation evidence has been verified." : (remarks || "Your evidence needs review.")
    }
  });

  res.json({ success: true, data: verification });
}
