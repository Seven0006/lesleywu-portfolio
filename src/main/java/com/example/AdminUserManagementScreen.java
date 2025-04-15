package com.example;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.util.Pair;

import java.sql.*;

public class AdminUserManagementScreen extends Application {

    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private ListView<String> userListView = new ListView<>();

    @Override
    public void start(Stage stage) {
        VBox root = new VBox(15);
        root.setPadding(new Insets(20));

        Label title = new Label("User Management");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Button refreshButton = new Button("🔄 Refresh");
        Button deleteButton = new Button("🗑️ Delete");
        Button editButton = new Button("✏️ Edit");
        Button closeButton = new Button("Close");
        Button backButton = new Button("Back");

        HBox buttonBox = new HBox(10, refreshButton, deleteButton, editButton, backButton, closeButton);

        refreshButton.setOnAction(e -> loadUsers());
        deleteButton.setOnAction(e -> deleteSelectedUser());
        editButton.setOnAction(e -> editSelectedUser());
        closeButton.setOnAction(e -> stage.close());
        backButton.setOnAction(e -> {
            AdminDashboardScreen dashboard = new AdminDashboardScreen();
            try {
                dashboard.start(new Stage());
                ((Stage) backButton.getScene().getWindow()).close(); // 关闭当前页面
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        root.getChildren().addAll(title, userListView, buttonBox);

        Scene scene = new Scene(root, 500, 400);
        stage.setScene(scene);
        stage.setTitle("Admin Panel - User Management");
        stage.show();

        loadUsers();
    }

    private void loadUsers() {
        userListView.getItems().clear();
        String sql = "SELECT id, name, email FROM users ORDER BY id";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                String userStr = rs.getInt("id") + " | " + rs.getString("name") + " | " + rs.getString("email");
                userListView.getItems().add(userStr);
            }
        } catch (Exception e) {
            showAlert("❌ Error loading users: " + e.getMessage());
        }
    }

    private void deleteSelectedUser() {
        String selected = userListView.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Please select a user to delete.");
            return;
        }
        int userId = Integer.parseInt(selected.split(" ")[0]);

        String sql = "DELETE FROM users WHERE id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.executeUpdate();
            showAlert("✅ User deleted.");
            loadUsers();
        } catch (Exception e) {
            showAlert("❌ Error deleting user: " + e.getMessage());
        }
    }

    private void editSelectedUser() {
        String selected = userListView.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("Please select a user to edit.");
            return;
        }

        int userId = Integer.parseInt(selected.split(" ")[0]);

        Dialog<Pair<String, String>> dialog = new Dialog<>();
        dialog.setTitle("Edit User");

        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.setPadding(new Insets(20, 150, 10, 10));

        TextField username = new TextField();
        username.setPromptText("New username");
        PasswordField password = new PasswordField();
        password.setPromptText("New password");

        grid.add(new Label("Username:"), 0, 0);
        grid.add(username, 1, 0);
        grid.add(new Label("Password:"), 0, 1);
        grid.add(password, 1, 1);

        dialog.getDialogPane().setContent(grid);
        dialog.getDialogPane().getButtonTypes().addAll(ButtonType.OK, ButtonType.CANCEL);

        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == ButtonType.OK) {
                return new javafx.util.Pair<>(username.getText(), password.getText());
            }
            return null;
        });

        dialog.showAndWait().ifPresent(result -> {
            String newName = result.getKey().trim();
            String newPass = result.getValue().trim();

            if (newName.isEmpty() || newPass.isEmpty()) {
                showAlert("⚠️ Fields cannot be empty.");
                return;
            }

            String updateSql = "UPDATE users SET name = ?, password = ? WHERE id = ?";
            try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                 PreparedStatement stmt = conn.prepareStatement(updateSql)) {
                stmt.setString(1, newName);
                stmt.setString(2, newPass);
                stmt.setInt(3, userId);
                stmt.executeUpdate();
                showAlert("✅ User updated.");
                loadUsers();
            } catch (Exception e) {
                showAlert("❌ Error updating user: " + e.getMessage());
            }
        });
    }

    private void showAlert(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
