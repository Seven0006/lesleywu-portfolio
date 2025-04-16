# 💼 Personal Finance Management System (JavaFX + PostgreSQL + Docker)

A JavaFX desktop GUI application that allows users to manage their personal finances. The system supports both **Regular Users** and **Admins**, offering transaction tracking, financial reports, user management, and export functionality.

---

## 📦 How to Run (Docker or Local)

### 1. Clone this repository

```bash
git clone < https://github.com/Seven0006/5100-Final-Project.git >
cd your-repo-folder
```

---

### 🔧 Option 1: Run using Docker

#### 🐳 Build Docker image:

```bash
docker build -t finance-app .
```

#### ▶️ Run container (PostgreSQL + App):

```bash
docker run -it --rm -p 5432:5432 finance-app
```

> GUI requires a desktop-enabled Docker or host integration (for JavaFX to open windows).

---

### ⚙️ Option 2: Run locally with Maven

Ensure you have Java 17+ and Maven installed.

```bash
mvn clean install
mvn javafx:run
```

> JavaFX SDK setup may be required in your IDE or via `pom.xml`.

---

## 🗂️ Application Features

### 👤 Regular User

- Register / Login
- Update personal profile (username / password)
- Record income or expense transactions
- View financial analysis by category (Pie Chart)
- View financial overview by month (Income / Expense / Balance)
- Export reports to CSV

---

### 🛠️ Admin User

- Admin login
- View all users
- Edit or delete users
- View monthly summary of each user (Income / Expense / Balance)
- Drill into individual transactions per user
- Export selected user data to CSV

---

## 🧱 Tech Stack

| Layer     | Technology       |
|-----------|------------------|
| UI        | JavaFX           |
| Backend   | Java 17          |
| Database  | PostgreSQL       |
| Build     | Maven            |
| Container | Docker           |

---

## 📊 PostgreSQL Setup

Default credentials:

```text
Host: localhost
Port: 5432
Database: mydb
User: postgres
Password: mysecretpassword
```

### 🧾 Required Tables

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DOUBLE PRECISION,
    category VARCHAR(50),
    type VARCHAR(10), -- 'income' or 'expense'
    date DATE
);
```

---

## 📁 Project Structure

```
src/
└── com.example/
    ├── LoginScreen.java
    ├── SignUpScreen.java
    ├── User.java
    ├── FinanceDashboard.java
    ├── UserInfoScreen.java
    ├── TransactionEntryScreen.java
    ├── FinancialAnalysisScreen.java
    ├── FinancialOverviewScreen.java
    ├── AdminDashboardScreen.java
    ├── AdminUserManagementScreen.java
    └── AdminDataManagementScreen.java
```

---

## 📄 Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/finance-app.jar /app/app.jar
CMD ["java", "-jar", "app.jar"]
```

> Replace `finance-app.jar` with your actual `.jar` name after Maven build.

---

## 🧠 Notes

- JavaFX GUI runs only in environments that support window displays.
- Exported CSV files are saved to user-specified locations via JavaFX `FileChooser`.
- The system uses role-based logic to separate admin and user access.

---

## ✍️ Author

- **Xinyu Wu, Yuyang Xie, Xiaoming Ma**
- INFO 5100 - Application Engineer & Dev

---