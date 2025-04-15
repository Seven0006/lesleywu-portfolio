package com.example;

import java.sql.*;

public class User {
    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private int id;
    private String name;
    private String email;
    private String password;
    private String role = "user"; // 默认普通用户

    // 构造函数
    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // 注册方法
    public boolean registerUser() {
        if (userExists()) return false;

        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, password);
            stmt.executeUpdate();
            return true;

        } catch (Exception e) {
            System.out.println("❌ Register failed: " + e.getMessage());
            return false;
        }
    }

    private boolean userExists() {
        String sql = "SELECT 1 FROM users WHERE name = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, name);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        } catch (Exception e) {
            return false;
        }
    }

    // 登录方法
    public boolean loginUser() {
        String sql = "SELECT * FROM users WHERE name = ? AND password = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, name);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                this.id = rs.getInt("id");
                this.email = rs.getString("email");
                this.role = rs.getString("role");
                return true;
            }

        } catch (Exception e) {
            System.out.println("❌ Login failed: " + e.getMessage());
        }
        return false;
    }

    // 更新用户名和密码
    public boolean updateUserInfo(String newName, String newPassword) {
        String sql = "UPDATE users SET name = ?, password = ? WHERE id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, newName);
            stmt.setString(2, newPassword);
            stmt.setInt(3, id); // 用 ID 定位用户
            int rows = stmt.executeUpdate();
            return rows > 0;

        } catch (Exception e) {
            System.out.println("❌ Update failed: " + e.getMessage());
            return false;
        }
    }

    public void viewProfile() {
        System.out.println("👤 Profile:");
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
        System.out.println("Role: " + role);
    }

    // Getter 和 Setter
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getPassword() { return password; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
}
