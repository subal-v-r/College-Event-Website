# TECHFEST 2025 – College Technical Symposium Event Management Platform

A **production-quality full-stack web application** for managing a national-level college technical symposium. Built to demonstrate a complete DevOps pipeline using GitHub, Jenkins, Docker, Kubernetes, Nagios, Graphite, and Grafana.

---

## 🏗️ Architecture

```
college-event-platform/
├── frontend/          # React 18 + Vite + TypeScript + Tailwind + MUI
├── backend/           # Node.js + Express + TypeScript + Prisma ORM
├── docker/            # Dockerfiles + Nginx config
├── kubernetes/        # K8s manifests (Deployments, Services, HPA, Ingress)
├── jenkins/           # Jenkinsfile CI/CD pipeline
└── docs/              # Documentation
```

## 🧰 Tech Stack

| Layer       | Technology                                              |
|-------------|--------------------------------------------------------|
| Frontend    | React 18, Vite, TypeScript, Tailwind CSS, MUI, Framer Motion |
| Backend     | Node.js, Express.js, TypeScript, Prisma ORM            |
| Database    | PostgreSQL 16                                           |
| Auth        | JWT (JSON Web Tokens), bcryptjs                        |
| DevOps      | Docker, Docker Compose, Kubernetes, Jenkins            |
| Monitoring  | `/health`, `/metrics`, `/version` endpoints            |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js ≥ 18
- PostgreSQL 16 (or Docker)
- npm

### 1. Clone and setup

```bash
git clone https://github.com/your-org/college-event-platform.git
cd college-event-platform
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL instance
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Backend runs at: `http://localhost:5000`
API Docs: `http://localhost:5000/api/docs`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Demo credentials

| Role    | Email                     | Password      |
|---------|---------------------------|---------------|
| Admin   | admin@techfest.edu        | Admin@1234    |
| Student | john.doe@gec.edu          | Student@1234  |

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Access at http://localhost:80
```

---

## ☸️ Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/pvc.yaml
kubectl apply -f kubernetes/deployments.yaml
kubectl apply -f kubernetes/services.yaml
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/ingress.yaml

# Check status
kubectl get all -n techfest
```

---

## 📊 Monitoring Endpoints

| Endpoint    | Description                               | Use Case                    |
|-------------|-------------------------------------------|-----------------------------|
| `GET /health`  | App + DB status                          | Kubernetes readiness/liveness probe |
| `GET /metrics` | CPU, memory, uptime, request stats      | Graphite / Grafana           |
| `GET /version` | App version and environment info        | Deployment verification      |

---

## 🔄 Jenkins Pipeline

The Jenkinsfile defines 13 stages:

1. **Checkout** – Pull source code
2. **Validate Environment** – Check Node, Docker, kubectl
3. **Install Backend Dependencies** – `npm ci`
4. **Install Frontend Dependencies** – `npm ci`
5. **Lint** – ESLint (parallel)
6. **Run Tests** – Jest with coverage
7. **Build Frontend** – Vite production build
8. **Build Backend** – TypeScript compilation
9. **Build Docker Images** – Multi-stage builds
10. **Push Docker Images** – Push to registry (main branch only)
11. **Deploy to Kubernetes** – Apply all manifests
12. **Update Image Tags** – Rolling update with new tag
13. **Verify Deployment** – Wait for rollout completion

### Required Jenkins Credentials

| ID                       | Type           | Description                  |
|--------------------------|----------------|------------------------------|
| `docker-hub-credentials` | Username/Pass  | Docker Hub login             |
| `kubeconfig-credentials` | Secret File    | Kubernetes cluster kubeconfig|

---

## 🔐 API Authentication

All protected endpoints require a JWT Bearer token:

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techfest.edu","password":"Admin@1234"}'

# Use token
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/v1/events
```

---

## 📖 API Reference

| Method | Endpoint                        | Auth     | Description                  |
|--------|---------------------------------|----------|------------------------------|
| POST   | `/api/v1/auth/login`            | Public   | Login                        |
| POST   | `/api/v1/auth/register`         | Public   | Register student account     |
| GET    | `/api/v1/auth/me`               | Required | Get current user             |
| GET    | `/api/v1/events`                | Public   | List events (filter/search)  |
| GET    | `/api/v1/events/:id`            | Public   | Get event details            |
| POST   | `/api/v1/events`                | Admin    | Create event                 |
| PUT    | `/api/v1/events/:id`            | Admin    | Update event                 |
| DELETE | `/api/v1/events/:id`            | Admin    | Delete event                 |
| GET    | `/api/v1/speakers`              | Public   | List speakers                |
| GET    | `/api/v1/schedules`             | Public   | Get schedule                 |
| GET    | `/api/v1/announcements`         | Public   | Get announcements            |
| POST   | `/api/v1/registrations`         | Required | Register for event           |
| GET    | `/api/v1/registrations/my`      | Required | Get my registrations         |
| GET    | `/api/v1/registrations`         | Admin    | View all registrations       |
| POST   | `/api/v1/contact`               | Public   | Submit contact form          |
| GET    | `/api/v1/dashboard/stats`       | Admin    | Dashboard statistics         |

Full Swagger docs: `http://localhost:5000/api/docs`

---

## 🌐 Public Pages

| Route             | Description                          |
|-------------------|--------------------------------------|
| `/`               | Home – hero, countdown, featured events |
| `/about`          | About the symposium                  |
| `/events`         | All events with search + filter      |
| `/events/:id`     | Event detail with registration link  |
| `/schedule`       | Timeline schedule by day             |
| `/speakers`       | Keynote and expert speakers          |
| `/register`       | Event registration form              |
| `/my-registrations` | Student's registered events        |
| `/announcements`  | Latest announcements                 |
| `/contact`        | Contact form + committee info        |
| `/faq`            | Frequently asked questions           |

## 🔒 Admin Pages

| Route                     | Description               |
|---------------------------|---------------------------|
| `/admin`                  | Dashboard with statistics |
| `/admin/events`           | Manage events (CRUD)      |
| `/admin/schedules`        | Manage schedule           |
| `/admin/speakers`         | Manage speakers           |
| `/admin/announcements`    | Manage announcements      |
| `/admin/registrations`    | View all registrations    |

