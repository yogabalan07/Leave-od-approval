import { Request, Response } from "express";
import { prisma } from "../config/database";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, registerNo, role = "STUDENT", departmentId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

    const user = await prisma.user.create({
      data: {
        name, email, registerNo, role,
        password: await hashPassword(password),
        departmentId
      },
      select: { id: true, name: true, email: true, registerNo: true, role: true, departmentId: true }
    });

    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password || "", user.password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, registerNo: user.registerNo, role: user.role, departmentId: user.departmentId }
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, registerNo: true, role: true, departmentId: true }
  });
  res.json({ success: true, user });
}
