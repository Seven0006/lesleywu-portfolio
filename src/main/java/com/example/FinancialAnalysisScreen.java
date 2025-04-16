package com.example;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.chart.PieChart;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class FinancialAnalysisScreen extends Application {

    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private User currentUser;

    public FinancialAnalysisScreen(User user) {
        this.currentUser = user;
    }

    @Override
    public void start(Stage stage) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(20));

        Label title = new Label("Financial Analysis");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");
        String currentMonth = LocalDate.now().getMonth().toString();
        Label monthLabel = new Label("Month: " + currentMonth);

        VBox topSection = new VBox(5, title, monthLabel);
        topSection.setAlignment(Pos.CENTER_LEFT);
        root.setTop(topSection);

        HBox centerContent = new HBox(40);
        centerContent.setAlignment(Pos.CENTER);

        VBox categoryList = new VBox(10);
        categoryList.setPadding(new Insets(10));
        categoryList.setPrefWidth(200);

        PieChart pieChart = new PieChart();
        pieChart.setPrefWidth(300);

        Map<String, Double> categoryTotals = loadCategoryTotals();
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            String category = entry.getKey();
            double total = entry.getValue();
            categoryList.getChildren().add(new Label(category + ": $" + String.format("%.2f", total)));
            pieChart.getData().add(new PieChart.Data(category, total));
        }

        centerContent.getChildren().addAll(categoryList, pieChart);
        root.setCenter(centerContent);

        Button closeButton = new Button("Close");
        closeButton.setOnAction(e -> stage.close());
        HBox bottom = new HBox(closeButton);
        bottom.setAlignment(Pos.CENTER_RIGHT);
        bottom.setPadding(new Insets(10));
        root.setBottom(bottom);

        Scene scene = new Scene(root, 600, 400);
        stage.setScene(scene);
        stage.setTitle("Financial Analysis");
        stage.show();
    }

    private Map<String, Double> loadCategoryTotals() {
        Map<String, Double> totals = new HashMap<>();
        String sql = "SELECT category, SUM(amount) FROM transactions " +
                     "WHERE user_id = ? AND type = 'expense' AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE) " +
                     "GROUP BY category";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, currentUser.getId());
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                String category = rs.getString(1);
                double total = rs.getDouble(2);
                totals.put(category, total);
            }
        } catch (Exception e) {
            System.out.println("❌ Failed to load data: " + e.getMessage());
        }
        return totals;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
