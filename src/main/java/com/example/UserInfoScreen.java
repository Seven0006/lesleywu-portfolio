package com.example;

import javafx.geometry.*;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class UserInfoScreen {

    private final User currentUser;

    public UserInfoScreen(User user) {
        this.currentUser = user;
    }

    public void show() {
        Stage stage = new Stage();
        stage.setTitle("User Information");

        Label titleLabel = new Label("User Information");
        titleLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        Label userLabel = new Label("Username:");
        TextField usernameField = new TextField(currentUser.getName());
        usernameField.setEditable(false);

        Label passLabel = new Label("Password:");
        PasswordField passwordField = new PasswordField();
        passwordField.setText(currentUser.getPassword());
        passwordField.setEditable(false);

        Button editButton = new Button("Edit");
        Button saveButton = new Button("Save");
        Button backButton = new Button("Back");

        // 点击 Edit 开启编辑
        editButton.setOnAction(e -> {
            usernameField.setEditable(true);
            passwordField.setEditable(true);
        });

        // 点击 Save 写入数据库
        saveButton.setOnAction(e -> {
            String newName = usernameField.getText().trim();
            String newPass = passwordField.getText().trim();

            if (newName.isEmpty() || newPass.isEmpty()) {
                showAlert("Error", "Fields cannot be empty.");
                return;
            }

            if (currentUser.updateUserInfo(newName, newPass)) {
                showAlert("Success", "User information updated.");
                currentUser.setName(newName);
                currentUser.setPassword(newPass);
                usernameField.setEditable(false);
                passwordField.setEditable(false);
            } else {
                showAlert("Error", "Update failed.");
            }
        });

        backButton.setOnAction(e -> stage.close());

        GridPane grid = new GridPane();
        grid.setAlignment(Pos.CENTER);
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(userLabel, 0, 0);
        grid.add(usernameField, 1, 0);
        grid.add(passLabel, 0, 1);
        grid.add(passwordField, 1, 1);

        HBox buttons = new HBox(15, saveButton, editButton, backButton);
        buttons.setAlignment(Pos.CENTER);

        VBox root = new VBox(20, titleLabel, grid, buttons);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(30));

        stage.setScene(new Scene(root, 400, 280));
        stage.show();
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }
}
