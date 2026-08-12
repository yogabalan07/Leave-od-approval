import { Request, Response } from "express";
import { prisma } from "../config/database";

export async function dashboard(_req: Request, res: Response) {
  const [students, mentors, hods, verifiers, ods, leaves, pendingVerification] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "MENTOR" } }),
    prisma.user.count({ where: { role: "HOD" } }),
    prisma.user.count({ where: { role: "VERIFIER" } }),
    prisma.oDApplication.count(),
    prisma.leaveApplication.count(),
    prisma.oDApplication.count({ where: { status: "VERIFICATION_PENDING" } })
  ]);
  res.json({ success: true, data: { students, mentors, hods, verifiers, ods, leaves, pendingVerification } });
}

export async function users(_req: Request, res: Response) {
  const data = await prisma.user.findMany({
    select: { id: true, name: true, email: true, registerNo: true, role: true, departmentId: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, data });
}
