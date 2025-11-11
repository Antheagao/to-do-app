# To-Do App

A modern, dark-themed task manager with secure sign-in, due dates/times, urgency, filtering, and sorting.

**Live site:** https://d1p7pk2h9bas4v.cloudfront.net

---

## ✨ Features

- **Auth:** Sign up / Sign in with JWT (ASP.NET Identity)
- **Tasks:** Create, update, delete
- **Details:** Title, description, **due date**, optional **due time**, **urgency (1–5)**
- **Views:** Sort (due date, urgency, newest), filter (status/urgency), search by title
- **UI:** Responsive, dark charcoal theme with blue accents; card layout
- **API:** RESTful JSON with Swagger docs
- **Ops:** `/health` probe, optional `/dbping` connectivity check, CORS configured for CloudFront

---

## 🧱 Tech Stack

**Frontend**
- React (Vite), Axios, modern CSS (custom properties)

**Backend**
- C# / ASP.NET Core Web API
- Entity Framework Core + ASP.NET Identity (JWT)

**Database**
- SQL Server (Amazon RDS)

**Infra / Deploy**
- Frontend: S3 + CloudFront  
- Backend: AWS App Runner (Docker image in ECR)  
- Networking: VPC connector, Security Groups  
- Observability: CloudWatch logs

---

## 📸 Screenshots

<!-- Home -->
<img src="./screenshots/todo-home.png" width="1000" alt="Home - Task grid with cards">
<em>Home — task grid with cards, dark UI</em>
<br><br>

<!-- Sign Up -->
<img src="./screenshots/todo-signup.png" width="1000" alt="Sign Up page">
<em>Sign Up — create an account</em>
<br><br>

<!-- Sign In -->
<img src="./screenshots/todo-signin.png" width="1000" alt="Sign In page">
<em>Sign In — secure login</em>
<br><br>

<!-- Create Task -->
<img src="./screenshots/todo-create-tasks.png" width="1000" alt="Create Task form">
<em>Create Task — title, description, due date/time, urgency</em>
<br><br>

<!-- View Task -->
<img src="./screenshots/todo-view-tasks.png" width="1000" alt="View Task details">
<em>View Task — details and metadata</em>
<br><br>

<!-- Edit Task -->
<img src="./screenshots/todo-edit-tasks.png" width="1000" alt="Edit Task form">
<em>Edit Task — update fields and save</em>
<br><br>

<!-- Tasks (list) -->
<img src="./screenshots/to-tasks.png" width="1000" alt="Tasks list view">
<em>Tasks — list view with sorting and filtering</em>
<br><br>

