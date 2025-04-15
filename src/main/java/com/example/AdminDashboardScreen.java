package com.example;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class AdminDashboardScreen extends Application {

    @Override
    public void start(Stage stage) {
        // 两个主按钮
        Button userManagementBtn = new Button("User Management");
        Button dataManagementBtn = new Button("Data Management");

        userManagementBtn.setPrefWidth(200);
        userManagementBtn.setPrefHeight(50);
        dataManagementBtn.setPrefWidth(200);
        dataManagementBtn.setPrefHeight(50);

        userManagementBtn.setStyle("-fx-font-size: 14px; -fx-font-weight: bold;");
        dataManagementBtn.setStyle("-fx-font-size: 14px; -fx-font-weight: bold;");

        // 布局
        HBox buttonBox = new HBox(30, userManagementBtn, dataManagementBtn);
        buttonBox.setAlignment(Pos.CENTER);

        VBox root = new VBox(50, buttonBox);
        root.setAlignment(Pos.CENTER);
        root.setPadding(new Insets(50));

        // 按钮逻辑（稍后实现）
        userManagementBtn.setOnAction(e -> {
            AdminUserManagementScreen userScreen = new AdminUserManagementScreen();
            try {
                userScreen.start(new Stage());
                stage.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        dataManagementBtn.setOnAction(e -> {
            AdminDataManagementScreen dataScreen = new AdminDataManagementScreen();
            try {
                dataScreen.start(new Stage());
                stage.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        // 场景
        Scene scene = new Scene(root, 600, 300);
        stage.setScene(scene);
        stage.setTitle("Admin Dashboard");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
