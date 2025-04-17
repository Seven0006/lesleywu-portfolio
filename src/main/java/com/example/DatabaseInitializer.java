package com.example;

import java.sql.*;

public class DatabaseInitializer {
    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    public static void initialize() {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             Statement stmt = conn.createStatement()) {

            stmt.execute(
                "CREATE TABLE IF NOT EXISTS users (" +
                "id SERIAL PRIMARY KEY, " +
                "name VARCHAR(100), " +
                "email VARCHAR(100), " +
                "password VARCHAR(100), " +
                "role VARCHAR(20) DEFAULT 'user')" 
            );

            stmt.execute(
                "CREATE TABLE IF NOT EXISTS transactions (" +
                "id SERIAL PRIMARY KEY, " +
                "user_id INTEGER REFERENCES users(id), " +
                "amount DECIMAL, " +
                "category VARCHAR(50), " +
                "type VARCHAR(10), " +
                "date DATE)"
            );

            System.out.println("✅ All necessary tables are ready.");

        } catch (SQLException e) {
            System.out.println("❌ DB Initialization Error: " + e.getMessage());
        }
    }
}
