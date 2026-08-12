import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function uploadEvidence(req: Request, res: Response) {
  const app = await prisma.oDApplication.findUnique({ where: { id: req.params.id } });
  if (!app || app.studentId !== req.user!.userId) return res.status(404).json({ success: false, message: "OD not found" });
  if (!["EVIDENCE_PENDING", "VERIFICATION_PENDING"].includes(app.status)) {
    return res.status(400).json({ success: false, message: "Evidence is not allowed for this application" });
  }
  if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({ success: false, message: "Valid GPS coordinates are required" });
  }

  const evidence = await prisma.participationEvidence.create({
    data: {
      odApplicationId: app.id,
      imageUrl: `/uploads/${req.file.filename}`,
      latitude,
      longitude,
      capturedAt: req.body.capturedAt ? new Date(req.body.capturedAt) : new Date(),
      description: req.body.description || null
    }
  });

  await prisma.oDApplication.update({
    where: { id: app.id },
    data: { status: "VERIFICATION_PENDING" }
  });

  const verifiers = await prisma.user.findMany({ where: { role: "VERIFIER" }, select: { id: true } });
  if (verifiers.length) {
    await prisma.notification.createMany({
      data: verifiers.map(v => ({
        userId: v.id,
        title: "New Evidence to Verify",
        message: `${app.applicationNumber} has new participation evidence.`
      }))
    });
  }

  res.status(201).json({ success: true, data: evidence });
}

export async function listEvidence(req: Request, res: Response) {
  const evidence = await prisma.participationEvidence.findMany({
    where: { odApplicationId: req.params.id },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data: evidence });
}
