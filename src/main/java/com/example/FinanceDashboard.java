package com.example;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.sql.*;

public class FinanceDashboard extends Application {

    // Database connection details
    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private TextField nameField = new TextField();
    private TextField emailField = new TextField();

    public static void main(String[] args) {
        launch(args); // Launch JavaFX Application
    }

    @Override
    public void start(Stage stage) {
        VBox root = new VBox(10);
        root.setStyle("-fx-padding: 15");

        Label title = new Label("📋 Registered Users");

        // List to show all users
        ListView<String> userList = new ListView<>();
        loadUsers(userList); // Load from DB

        // Input form to add a new user
        nameField.setPromptText("Name");
        emailField.setPromptText("Email");
        Button addButton = new Button("Add User");
        addButton.setOnAction(e -> {
            insertUser(nameField.getText(), emailField.getText());
            loadUsers(userList); // Refresh
            nameField.clear();
            emailField.clear();
        });

        HBox form = new HBox(10, nameField, emailField, addButton);

        root.getChildren().addAll(title, userList, new Label("➕ Add New User"), form);

        // Set scene and show
        Scene scene = new Scene(root, 450, 400);
        stage.setScene(scene);
        stage.setTitle("Personal Finance Management System - Dashboard");
        stage.show();
    }

    // Load users from PostgreSQL and show in ListView
    private void loadUsers(ListView<String> list) {
        list.getItems().clear();
        String sql = "SELECT * FROM users;";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            System.out.println("Connected to database");
            while (rs.next()) {
                String entry = rs.getInt("id") + " | " + rs.getString("name") + " | " + rs.getString("email");
                list.getItems().add(entry);
            }
        } catch (Exception e) {
            list.getItems().add("❌ Error: " + e.getMessage());
        }
    }

    // Insert a new user into database
    private void insertUser(String name, String email) {
        if (name.isEmpty() || email.isEmpty()) {
            showAlert("Validation Error", "Name and email cannot be empty.");
            return;
        }

        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.executeUpdate();

        } catch (Exception e) {
            showAlert("Database Error", e.getMessage());
        }
    }

    // Helper: show error/info dialog
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
