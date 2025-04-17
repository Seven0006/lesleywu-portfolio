package com.example;

import javafx.geometry.*;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.GridPane;
import javafx.stage.Stage;

public class FinanceDashboard {

    private final User currentUser;

    // receive user information from login screen
    public FinanceDashboard(User user) {
        this.currentUser = user;
    }

    public void start(Stage primaryStage) {
        primaryStage.setTitle("Personal Finance Management - Dashboard");

        // buttons
        Button userInfoBtn = new Button("User Information");
        Button financialAnalysisBtn = new Button("Financial Analysis");
        Button transactionEntryBtn = new Button("Transaction Entry");
        Button financialOverviewBtn = new Button("Financial Overview");

        userInfoBtn.setPrefWidth(200);
        financialAnalysisBtn.setPrefWidth(200);
        transactionEntryBtn.setPrefWidth(200);
        financialOverviewBtn.setPrefWidth(200);

        // button actions
        userInfoBtn.setOnAction(e -> {
            UserInfoScreen infoScreen = new UserInfoScreen(currentUser);
            infoScreen.show();
        });

        transactionEntryBtn.setOnAction(e -> {
            new TransactionEntryScreen(currentUser).show();
        });
        
        financialAnalysisBtn.setOnAction(e -> {
            new FinancialAnalysisScreen(currentUser).start(new Stage());
        });

        financialOverviewBtn.setOnAction(e -> {
            new FinancialOverviewScreen(currentUser).start(new Stage());
        });


        // layout
        GridPane grid = new GridPane();
        grid.setPadding(new Insets(30));
        grid.setHgap(20);
        grid.setVgap(20);
        grid.setAlignment(Pos.CENTER);

        grid.add(userInfoBtn, 0, 0);
        grid.add(financialAnalysisBtn, 1, 0);
        grid.add(transactionEntryBtn, 0, 1);
        grid.add(financialOverviewBtn, 1, 1);

        // scene setup
        Scene scene = new Scene(grid, 500, 350);
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
