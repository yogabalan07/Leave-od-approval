import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const department = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: { name: "Computer Science and Engineering", code: "CSE" }
  });

  const users = [
    { name: "Demo Student", email: "student@college.edu", registerNo: "CSE001", role: Role.STUDENT },
    { name: "Demo Mentor", email: "mentor@college.edu", registerNo: "FAC001", role: Role.MENTOR },
    { name: "Demo HOD", email: "hod@college.edu", registerNo: "HOD001", role: Role.HOD },
    { name: "Demo Verifier", email: "verifier@college.edu", registerNo: "VER001", role: Role.VERIFIER },
    { name: "System Admin", email: "admin@college.edu", registerNo: "ADM001", role: Role.ADMIN }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password,
        departmentId: department.id
      }
    });
  }

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
