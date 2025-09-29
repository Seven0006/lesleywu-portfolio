# 💼 Personal Finance Management System (JavaFX + PostgreSQL + Docker)

A JavaFX desktop GUI application that allows users to manage their personal finances. The system supports both **Regular Users** and **Admins**, offering transaction tracking, financial reports, user management, and export functionality.

---

## 📦 How to Run (Docker or Local)

### 1. Clone this repository

```bash
git clone https://github.com/Seven0006/lesleywu-portfolio.git

cd your-repo-folder
```

---

## 💻 Running Locally via JavaFX + Maven

### 1. Prerequisites

- [Java 17 or later](https://bell-sw.com/pages/downloads/#mac)
- [Maven](https://maven.apache.org/download.cgi)
- [PostgreSQL](https://www.postgresql.org/download/macosx/)

### 2. Install PostgreSQL (macOS via Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

Then create the required database and user:

```bash
psql postgres
```
Run below command one by one:
```sql
CREATE DATABASE mydb;
CREATE USER postgres WITH PASSWORD 'mysecretpassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO postgres;
\q
```

### 3. Build and Run the App

```bash
mvn clean javafx:run
```

💡 Upon startup, the program will automatically create all required tables (e.g., `users`, `transactions`) if they do not exist.

---
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

INSERT INTO users (name, email, password, role)
VALUES ('admin', 'admin@admin.com', 'admin', 'admin');
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

- **Xinyu Wu**

---