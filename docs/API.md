# API

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

POST /api/od
GET /api/od/my
GET /api/od/:id

POST /api/leave
GET /api/leave/my

GET /api/mentor/queue
PATCH /api/mentor/od/:id
PATCH /api/mentor/leave/:id

GET /api/hod/queue
PATCH /api/hod/od/:id
PATCH /api/hod/leave/:id

POST /api/evidence/od/:id
GET /api/evidence/od/:id

GET /api/verification/queue
PATCH /api/verification/:id

GET /api/admin/dashboard
GET /api/admin/users
