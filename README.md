# ☢️ RadSafe360 – Radiation Safety Asset & Compliance Management System

## Overview

RadSafe360 is an enterprise-grade Radiation Safety Asset & Compliance Management System designed for industrial environments to digitally manage radiation-related assets, regulatory compliance records, personnel certifications, meetings, training manuals, and safety documentation.

The platform centralizes radiation safety operations into a unified dashboard, enabling Radiation Safety Officers (RSOs), compliance teams, and plant administrators to efficiently monitor assets, track certifications, manage meetings, and maintain regulatory readiness.

---

## Key Features

### 📊 Executive Dashboard

* Real-time KPI monitoring
* Plant-wise gauge distribution
* Survey meter status analytics
* RSO certification insights
* Compliance meeting overview
* Interactive charts and visualizations

### ☢️ Radiation Gauge Management

* Complete gauge inventory management
* Lifecycle status tracking
* Installation details and history
* Gauge categorization
* Search and filtering capabilities

### 📟 Survey Meter Management

* Survey meter inventory tracking
* Working / Not Working status monitoring
* Calibration and maintenance records
* Asset utilization visibility

### 👨‍🔬 RSO Personnel Management

* Certified personnel database
* Certificate management and uploads
* Validity tracking
* Department-wise personnel records
* Compliance monitoring

### 📅 Meeting & MOM Management

* Meeting scheduling
* Participant management
* Action item tracking
* MOM generation
* Attendance management
* RSO personnel integration

### 📚 Training & Documentation

* Training manual repository
* Document upload and preview
* Safety procedure management
* Version-controlled documentation

### 🏛 ELORA Information Management

* ELORA portal information management
* Regulatory details tracking
* Authorized personnel records

### 📑 Compliance Reporting

* Centralized report repository
* Document management
* Compliance documentation tracking

---

## System Modules

| Module           | Description                           |
| ---------------- | ------------------------------------- |
| Dashboard        | Executive compliance overview         |
| Gauges           | Radiation source inventory management |
| Survey Meters    | Monitoring equipment management       |
| RSO Personnel    | Certified personnel management        |
| Meetings         | Meeting & MOM management              |
| Attendance       | Participant attendance tracking       |
| ELORA            | Regulatory information management     |
| Reports          | Compliance reporting system           |
| Training Manuals | Documentation repository              |
| Settings         | Application configuration             |

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Recharts
* React Router
* Lucide React

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### Additional Features

* REST API Architecture
* File Upload Management
* Email Notification Services
* Dynamic Dashboard Analytics

---

## System Architecture

Frontend (React + Vite)
↓
REST APIs
↓
Node.js + Express
↓
Prisma ORM
↓
PostgreSQL Database

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Shorya11/RadSafe360-Radiation-Asset-Management-System.git
cd RadSafe360-Radiation-Asset-Management-System
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Database Setup

### Configure Environment Variables

Create:

```env
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/radsafe360"
PORT=5000
```

### Run Prisma Migration

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

## Future Enhancements

* Role-Based Access Control (RBAC)
* Multi-Plant Support
* Calibration Reminder System
* Audit Trail Logging
* Mobile Responsive Field Inspection Module
* Automated Regulatory Compliance Alerts
* Advanced Reporting & BI Dashboard
* Cloud Deployment & Backup Integration
* AI-Powered Compliance Analytics

---

## Project Highlights

* Enterprise-grade industrial dashboard
* End-to-end radiation safety asset management
* Regulatory compliance tracking
* Modern React + Node.js architecture
* PostgreSQL + Prisma integration
* Modular and scalable design

---

## Author

**Shorya Dixit**

B.Tech Computer Science & Engineering
VIT Bhopal University

GitHub: https://github.com/Shorya11

---

## License

This project is developed for educational, industrial learning, and compliance management purposes.
