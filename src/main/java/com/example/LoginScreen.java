package com.example;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.geometry.*;

public class LoginScreen extends Application {

    @Override
    public void start(Stage primaryStage) {
        Label titleLabel = new Label("Personal Finance Management System");
        titleLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Label userLabel = new Label("Username:");
        TextField usernameField = new TextField();

        Label passLabel = new Label("Password:");
        PasswordField passwordField = new PasswordField();

        Button signInButton = new Button("Sign in");
        Button signUpButton = new Button("Sign up");
        Button exitButton = new Button("Exit");

        signInButton.setOnAction(e -> {
            String user = usernameField.getText().trim();
            String password = passwordField.getText().trim();

            User u = new User();
            u.setName(user);
            u.setPassword(password);


            if (u.loginUser()) {
                showAlert("✅ Login successful", "Welcome, " + user + "!");
            
                Stage nextStage = new Stage();
                try {
                    if ("admin".equalsIgnoreCase(u.getRole())) {
                        new AdminDashboardScreen().start(nextStage); // to admin dashboard
                    } else {
                        new FinanceDashboard(u).start(nextStage); // to user dashboard
                    }
                    ((Stage) signInButton.getScene().getWindow()).close();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }

            } else {
                showAlert("❌ Login failed", "Invalid username or password.");
            }
            
            
        });

        signUpButton.setOnAction(e -> {
            try {
                new SignUpScreen().start(new Stage());
                ((Stage) signUpButton.getScene().getWindow()).close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        exitButton.setOnAction(e -> primaryStage.close());

        GridPane form = new GridPane();
        form.setVgap(10);
        form.setHgap(10);
        form.setAlignment(Pos.CENTER);
        form.add(userLabel, 0, 0);
        form.add(usernameField, 1, 0);
        form.add(passLabel, 0, 1);
        form.add(passwordField, 1, 1);

        HBox buttons = new HBox(10, signInButton, signUpButton, exitButton);
        buttons.setAlignment(Pos.CENTER);

        VBox root = new VBox(20, titleLabel, form, buttons);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(30));

        Scene scene = new Scene(root, 400, 300);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Login");
        primaryStage.show();
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        DatabaseInitializer.initialize();
        launch(args);
    }
}
