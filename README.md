# Smart OD System

A college Leave & On-Duty approval system built with:

- React + Vite + TypeScript
- Express.js + Node.js + TypeScript
- Prisma ORM
- PostgreSQL / Neon
- JWT authentication
- Multer evidence uploads
- Geo-tagged participation evidence
- Mentor → HOD → Verifier workflow

## Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
# Put your NEW Neon DATABASE_URL in .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Demo accounts

After `npm run seed`:

- Student: student@college.edu / password123
- Mentor: mentor@college.edu / password123
- HOD: hod@college.edu / password123
- Verifier: verifier@college.edu / password123
- Admin: admin@college.edu / password123

## Important

Never commit `.env`. Rotate any database password that has been exposed in chat, screenshots, GitHub, or logs.
