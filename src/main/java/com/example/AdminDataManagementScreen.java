package com.example;

import javafx.application.Application;
import javafx.geometry.*;
import javafx.scene.Scene;
import javafx.scene.control.*;
// import javafx.scene.control.cell.CheckBoxTableCell;
import javafx.scene.layout.*;
import javafx.stage.*;

import java.io.File;
import java.io.FileWriter;
import java.sql.*;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
// import java.util.stream.Collectors;

public class AdminDataManagementScreen extends Application {

    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private ComboBox<String> monthSelector = new ComboBox<>();
    private VBox userList = new VBox(10);
    private Map<String, Boolean> selectedMap = new HashMap<>();

    @Override
    public void start(Stage stage) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(20));

        Label title = new Label("Data Information");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        // 月份选择器
        List<String> monthOptions = getRecentMonths(6);
        monthSelector.getItems().addAll(monthOptions);
        monthSelector.setValue(monthOptions.get(0));
        monthSelector.setOnAction(e -> refreshList());

        VBox topBox = new VBox(10, title, monthSelector);
        topBox.setAlignment(Pos.CENTER);

        ScrollPane scrollPane = new ScrollPane(userList);
        scrollPane.setFitToWidth(true);
        scrollPane.setPrefHeight(250);

        Button exportBtn = new Button("Export");
        exportBtn.setOnAction(e -> exportSelectedUsers(stage));

        Button backButton = new Button("Back");
        backButton.setOnAction(e -> {
            AdminDashboardScreen dashboard = new AdminDashboardScreen();
            try {
                dashboard.start(new Stage());
                ((Stage) backButton.getScene().getWindow()).close(); // 关闭当前页面
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        Button closeBtn = new Button("Exit");
        closeBtn.setOnAction(e -> stage.close());

        HBox btnBox = new HBox(10, exportBtn, backButton, closeBtn);
        btnBox.setAlignment(Pos.CENTER_RIGHT);

        root.setTop(topBox);
        root.setCenter(scrollPane);
        root.setBottom(btnBox);
        BorderPane.setMargin(btnBox, new Insets(10, 0, 0, 0));

        refreshList();

        Scene scene = new Scene(root, 650, 450);
        stage.setScene(scene);
        stage.setTitle("Admin - Data Management");
        stage.show();
    }

    private List<String> getRecentMonths(int count) {
        List<String> list = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 0; i < count; i++) {
            LocalDate past = now.minusMonths(i);
            String label = past.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + past.getYear();
            list.add(label);
        }
        return list;
    }

    private void refreshList() {
        userList.getChildren().clear();
        selectedMap.clear();

        String[] parts = monthSelector.getValue().split(" ");
        int month = Month.valueOf(parts[0].toUpperCase()).getValue();
        int year = Integer.parseInt(parts[1]);

        String sql = "SELECT u.name, u.id, " +
             "SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS income, " +
             "SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS expense " +
             "FROM users u " +
             "LEFT JOIN transactions t ON u.id = t.user_id " +
             "AND EXTRACT(MONTH FROM t.date) = ? AND EXTRACT(YEAR FROM t.date) = ? " +
             "GROUP BY u.name, u.id " +
             "ORDER BY u.name";


        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, month);
            stmt.setInt(2, year);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                String name = rs.getString("name");
                int uid = rs.getInt("id");
                double income = rs.getDouble("income");
                double expense = rs.getDouble("expense");
                double balance = income - expense;

                CheckBox checkBox = new CheckBox();
                selectedMap.put(name, false);
                checkBox.selectedProperty().addListener((obs, oldVal, newVal) -> selectedMap.put(name, newVal));

                Button viewBtn = new Button("→");
                int finalUid = uid;
                viewBtn.setOnAction(e -> openUserDetail(finalUid, name, month, year));

                HBox row = new HBox(10, checkBox,
                        new Label(name),
                        new Label(String.format("Income: $%.2f", income)),
                        new Label(String.format("Expense: $%.2f", expense)),
                        new Label(String.format("Balance: $%.2f", balance)),
                        viewBtn);
                row.setAlignment(Pos.CENTER_LEFT);
                userList.getChildren().add(row);
            }

        } catch (Exception e) {
            userList.getChildren().add(new Label("❌ Error: " + e.getMessage()));
        }
    }

    private void exportSelectedUsers(Stage parentStage) {
        List<String> selected = selectedMap.entrySet().stream()
                .filter(Map.Entry::getValue)
                .map(Map.Entry::getKey)
                .toList();

        if (selected.isEmpty()) {
            showAlert("No selection", "Please select at least one user.");
            return;
        }

        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Save Export File");
        fileChooser.setInitialFileName("admin-data-export.csv");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV", "*.csv"));
        File file = fileChooser.showSaveDialog(parentStage);
        if (file == null) return;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             FileWriter fw = new FileWriter(file)) {

            fw.write("Username,Date,Type,Category,Amount\n");

            String userSql = "SELECT id, name FROM users WHERE name = ANY(?)";
            Array userArray = conn.createArrayOf("text", selected.toArray());

            PreparedStatement userStmt = conn.prepareStatement(userSql);
            userStmt.setArray(1, userArray);

            ResultSet userRs = userStmt.executeQuery();
            while (userRs.next()) {
                int uid = userRs.getInt("id");
                String uname = userRs.getString("name");

                String txnSql = "SELECT date, type, category, amount FROM transactions WHERE user_id = ?";
                PreparedStatement txnStmt = conn.prepareStatement(txnSql);
                txnStmt.setInt(1, uid);
                ResultSet txnRs = txnStmt.executeQuery();

                while (txnRs.next()) {
                    fw.write(String.format("%s,%s,%s,%s,%.2f\n",
                            uname,
                            txnRs.getDate("date"),
                            txnRs.getString("type"),
                            txnRs.getString("category"),
                            txnRs.getDouble("amount")));
                }
            }

            showAlert("✅ Exported", "CSV file saved successfully.");

        } catch (Exception e) {
            showAlert("❌ Error", e.getMessage());
        }
    }

    private void openUserDetail(int userId, String username, int month, int year) {
        Stage detailStage = new Stage();
        detailStage.setTitle("Details for " + username);

        VBox root = new VBox(10);
        root.setPadding(new Insets(20));

        Label title = new Label("Transactions for " + username);
        title.setStyle("-fx-font-size: 16px; -fx-font-weight: bold;");

        VBox txnList = new VBox(5);

        String sql = "SELECT date, category, type, amount " +
        "FROM transactions " +
        "WHERE user_id = ? AND EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ? " +
        "ORDER BY date DESC";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setInt(2, month);
            stmt.setInt(3, year);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                LocalDate date = rs.getDate("date").toLocalDate();
                String type = rs.getString("type");
                String category = rs.getString("category");
                double amount = rs.getDouble("amount");

                Label entry = new Label(String.format("Date: %s | %s | %s | $%.2f", date, type, category, amount));
                txnList.getChildren().add(entry);
            }

        } catch (Exception e) {
            txnList.getChildren().add(new Label("❌ Error: " + e.getMessage()));
        }

        Button closeBtn = new Button("Close");
        closeBtn.setOnAction(e -> detailStage.close());

        root.getChildren().addAll(title, new ScrollPane(txnList), closeBtn);
        Scene scene = new Scene(root, 500, 400);
        detailStage.setScene(scene);
        detailStage.show();
    }

    private void showAlert(String t, String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(t);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
