package com.example;

import javafx.application.Application;
import javafx.geometry.*;
import javafx.scene.Scene;
import javafx.scene.chart.PieChart;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.scene.Node;
import java.sql.*;
import java.time.*;
import java.time.format.TextStyle;
import java.util.*;

public class FinancialAnalysisScreen extends Application {

    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private User currentUser;
    private PieChart pieChart;
    private VBox categoryList;
    private ComboBox<String> monthSelector;
    private RadioButton incomeRadio;
    private RadioButton expenseRadio;

    public FinancialAnalysisScreen(User user) {
        this.currentUser = user;
    }

    @Override
    public void start(Stage stage) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(20));

        // Title label
        Label title = new Label("Financial Analysis");
        title.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");

        // Month selector (dropdown for year-month)
        monthSelector = new ComboBox<>();
        monthSelector.getItems().addAll(getRecentMonths(6));
        monthSelector.setValue(monthSelector.getItems().get(0));
        monthSelector.setOnAction(e -> updateChart());

        // Toggle group for income/expense
        ToggleGroup typeGroup = new ToggleGroup();
        incomeRadio = new RadioButton("Income");
        expenseRadio = new RadioButton("Expense");
        incomeRadio.setToggleGroup(typeGroup);
        expenseRadio.setToggleGroup(typeGroup);
        expenseRadio.setSelected(true);

        HBox controls = new HBox(10, new Label("Month:"), monthSelector, incomeRadio, expenseRadio);
        controls.setAlignment(Pos.CENTER_LEFT);

        Button loadBtn = new Button("Load");
        loadBtn.setOnAction(e -> updateChart());

        VBox topSection = new VBox(10, title, controls, loadBtn);
        topSection.setAlignment(Pos.CENTER_LEFT);
        root.setTop(topSection);

        HBox centerContent = new HBox(40);
        centerContent.setAlignment(Pos.CENTER);

        categoryList = new VBox(10);
        categoryList.setPadding(new Insets(10));
        categoryList.setPrefWidth(250);

        pieChart = new PieChart();
        pieChart.setPrefWidth(500);

        centerContent.getChildren().addAll(categoryList, pieChart);
        root.setCenter(centerContent);

        Button closeButton = new Button("Close");
        closeButton.setOnAction(e -> stage.close());
        HBox bottom = new HBox(closeButton);
        bottom.setAlignment(Pos.CENTER_RIGHT);
        bottom.setPadding(new Insets(10));
        root.setBottom(bottom);

        Scene scene = new Scene(root, 700, 500);
        stage.setScene(scene);
        stage.setTitle("Financial Analysis");
        stage.show();

        // Initial data load
        updateChart();
    }

    // Generate recent months for the dropdown
    private List<String> getRecentMonths(int count) {
        List<String> months = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 0; i < count; i++) {
            LocalDate past = today.minusMonths(i);
            String monthYear = past.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + past.getYear();
            months.add(monthYear);
        }
        return months;
    }

    // Update chart based on selected month
    private void updateChart() {
        // Clear previous data
        pieChart.getData().clear();
        categoryList.getChildren().clear();

        // Get selected date and type
        String selectedMonth = monthSelector.getValue();
        if (selectedMonth == null) {
            showAlert("Please select a month.");
            return;
        }

        String[] parts = selectedMonth.split(" ");
        String month = parts[0].toUpperCase();
        int year = Integer.parseInt(parts[1]);

        String type = incomeRadio.isSelected() ? "income" : "expense";

        Map<String, Double> categoryTotals = loadCategoryTotals(currentUser.getId(), year, month, type);
        if (categoryTotals.isEmpty()) {
            showAlert("No data available for selected month and type.");
            return;
        }

        // Calculate total for percentage calculation
        double totalAmount = categoryTotals.values().stream().mapToDouble(Double::doubleValue).sum();

        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            String category = entry.getKey();
            double total = entry.getValue();
            double percentage = (total / totalAmount) * 100;

            // Add category label with percentage
            categoryList.getChildren().add(new Label(
                    category + ": $" + String.format("%.2f", total)));

            // Add data to PieChart
            PieChart.Data data = new PieChart.Data(category, total);
            data.setName(category + ": $" + String.format("%.2f%%", percentage));
            pieChart.getData().add(data);
        }

        // Legend modification: show only category names
        for (PieChart.Data data : pieChart.getData()) {
            for (Node node : pieChart.lookupAll(".chart-legend-item")) {
                if (node instanceof Label) {
                    Label label = (Label) node;
                    if (label.getText().equals(data.getName())) {
                        label.setText(data.getName().split(":")[0]);
                    }
                }
            }
        }
    }

    // Load totals for given user, date, and type
    private Map<String, Double> loadCategoryTotals(int userId, int year, String month, String type) {
        Map<String, Double> totals = new HashMap<>();
        String sql = "SELECT category, SUM(amount) FROM transactions " +
                "WHERE user_id = ? AND type = ? AND EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ? " +
                "GROUP BY category";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setInt(3, Month.valueOf(month).getValue());
            stmt.setInt(4, year);
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

    // Show alert dialog
    private void showAlert(String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Notice");
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        User demoUser = new User("demo", "demo@example.com", "password123");
        new FinancialAnalysisScreen(demoUser).start(new Stage());
    }
}
