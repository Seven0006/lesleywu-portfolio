package com.example;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.geometry.*;

public class SignUpScreen extends Application {

    @Override
    public void start(Stage primaryStage) {
        Label titleLabel = new Label("Personal Finance Management System");
        titleLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Label userLabel = new Label("Username:");
        TextField usernameField = new TextField();

        Label passLabel = new Label("Password:");
        PasswordField passwordField = new PasswordField();

        Label repeatLabel = new Label("Repeat Password:");
        PasswordField repeatPasswordField = new PasswordField();

        Button signUpButton = new Button("Sign up");
        Button backToLogin = new Button("Back to Login");
        Button exitButton = new Button("Exit");

        signUpButton.setOnAction(e -> {
            String user = usernameField.getText().trim();
            String pass = passwordField.getText().trim();
            String repeat = repeatPasswordField.getText().trim();

            if (user.isEmpty() || pass.isEmpty() || repeat.isEmpty()) {
                showAlert("❗ Missing Info", "Please fill in all fields.");
                return;
            }

            if (!pass.equals(repeat)) {
                showAlert("❗ Password Mismatch", "Passwords do not match.");
                return;
            }

            User u = new User(user, "", pass);
            if (u.registerUser()) {
                showAlert("✅ Registered", "Account created. Please sign in.");
                new LoginScreen().start(new Stage());
                ((Stage) signUpButton.getScene().getWindow()).close();
            } else {
                showAlert("❌ Error", "Username may already exist.");
            }
        });

        backToLogin.setOnAction(e -> {
            try {
                new LoginScreen().start(new Stage());
                ((Stage) backToLogin.getScene().getWindow()).close();
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
        form.add(repeatLabel, 0, 2);
        form.add(repeatPasswordField, 1, 2);

        HBox buttons = new HBox(20, signUpButton, backToLogin, exitButton);
        buttons.setAlignment(Pos.CENTER);

        VBox root = new VBox(20, titleLabel, form, buttons);
        root.setPadding(new Insets(30));
        root.setAlignment(Pos.CENTER);

        Scene scene = new Scene(root, 400, 320);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Sign Up");
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
        launch(args);
    }
}
