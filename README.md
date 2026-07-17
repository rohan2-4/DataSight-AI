# 📊 DataSight AI

An AI-powered data analytics platform built with **FastAPI**, **React**, and **PostgreSQL** that allows users to upload CSV files, perform data analysis, visualize insights, and securely manage datasets using JWT authentication.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected API Endpoints

### 📁 File Management
- Upload CSV Files
- View Uploaded Files
- Rename Uploaded Files
- Delete Uploaded Files
- Pagination
- Search & Sorting

### 📈 Data Analytics
- CSV Parsing using Pandas
- Dataset Summary
- Row & Column Information
- Data Visualization
- Interactive Charts
- AI-based Data Insights

### 📤 Export
- Export Results to CSV
- Export Reports to PDF

### 🎨 User Interface
- Responsive Dashboard
- Modern React UI
- Toast Notifications
- Interactive Charts
- Clean User Experience

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Chart.js
- Recharts
- jsPDF
- PapaParse
- React Toastify

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- Passlib (bcrypt)
- Python-JOSE (JWT)
- Uvicorn

---

# 📂 Project Structure

```
DataSight-AI
│
├── backend
│   ├── models
│   ├── routers
│   ├── schemas
│   ├── datasets
│   ├── security.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/DataSight-AI.git

cd DataSight-AI
```

---

# Backend Setup

Create Virtual Environment

```bash
python -m venv venv
```

Activate

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run Project

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register User |
| POST | /login | User Login |

---

## Upload

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /upload | Upload CSV |
| GET | /uploads | Get Uploads |
| PUT | /uploads/{id} | Update File |
| DELETE | /uploads/{id} | Delete File |

---

# Authentication

This project uses **JWT (JSON Web Token)** authentication.

Protected endpoints require:

```
Authorization: Bearer <your_access_token>
```

---

# Screenshots

Add screenshots here after deployment.

- Login Page
- Register Page
- Dashboard
- Upload Page
- Charts
- Analytics
- Swagger API

---

# Future Improvements

- AI-powered predictive analytics
- Machine Learning models
- Data cleaning suggestions
- Excel support
- Drag & Drop Upload
- User Profile
- Admin Dashboard
- Cloud Storage Integration
- Email Verification
- Password Reset

---

# License

This project is licensed under the MIT License.

---

# Author

**Rohan Gadade**

GitHub:
https://github.com/rohan2-4

Portfolio:
https://rohan2-4.github.io/Mywebsite/

LinkedIn:
(Add your LinkedIn profile here)

---

⭐ If you like this project, consider giving it a Star on GitHub.
