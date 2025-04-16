package com.example;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import java.io.File;
import java.io.PrintWriter;
import java.sql.*;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

public class FinancialOverviewScreen extends Application {

    private static final String URL = "jdbc:postgresql://localhost:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    private VBox transactionList = new VBox(10);
    private ComboBox<String> monthSelector = new ComboBox<>();
    private User currentUser;

    public FinancialOverviewScreen(User user) {
        this.currentUser = user;
    }

    @Override
    public void start(Stage stage) {
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(20));

        Label title = new Label("Financial Overview");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        List<String> monthOptions = getRecentMonths(6);
        monthSelector.getItems().addAll(monthOptions);
        monthSelector.setValue(monthOptions.get(0));
        monthSelector.setOnAction(e -> updateTransactionList());

        VBox topBox = new VBox(10, title, monthSelector);
        topBox.setAlignment(Pos.CENTER);

        ScrollPane scrollPane = new ScrollPane(transactionList);
        scrollPane.setFitToWidth(true);
        scrollPane.setPrefHeight(250);

        Button exportButton = new Button("Export");
        exportButton.setOnAction(e -> exportToCSV(stage));

        Button closeButton = new Button("Close");
        closeButton.setOnAction(e -> stage.close());

        HBox buttons = new HBox(10, exportButton, closeButton);
        buttons.setAlignment(Pos.CENTER_RIGHT);

        root.setTop(topBox);
        root.setCenter(scrollPane);
        root.setBottom(buttons);
        BorderPane.setMargin(buttons, new Insets(15, 0, 0, 0));

        updateTransactionList();

        Scene scene = new Scene(root, 600, 400);
        stage.setScene(scene);
        stage.setTitle("Financial Overview");
        stage.show();
    }

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

    private void updateTransactionList() {
        transactionList.getChildren().clear();
        String selected = monthSelector.getValue();
        if (selected == null) return;

        String[] parts = selected.split(" ");
        String month = parts[0].toUpperCase();
        int year = Integer.parseInt(parts[1]);

        String sql = "SELECT date, type, SUM(amount) FROM transactions " +
                     "WHERE user_id = ? AND EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ? " +
                     "GROUP BY date, type ORDER BY date DESC";

        Map<LocalDate, Double> incomeMap = new HashMap<>();
        Map<LocalDate, Double> expenseMap = new HashMap<>();

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, currentUser.getId());
            stmt.setInt(2, Month.valueOf(month).getValue());
            stmt.setInt(3, year);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                LocalDate date = rs.getDate("date").toLocalDate();
                String type = rs.getString("type");
                double amount = rs.getDouble("sum");
                if ("income".equalsIgnoreCase(type)) {
                    incomeMap.put(date, amount);
                } else {
                    expenseMap.put(date, amount);
                }
            }

            Set<LocalDate> allDates = new HashSet<>();
            allDates.addAll(incomeMap.keySet());
            allDates.addAll(expenseMap.keySet());
            List<LocalDate> sortedDates = allDates.stream().sorted(Comparator.reverseOrder()).collect(Collectors.toList());

            for (LocalDate d : sortedDates) {
                double income = incomeMap.getOrDefault(d, 0.0);
                double expense = expenseMap.getOrDefault(d, 0.0);
                double balance = income - expense;
                Label row = new Label("Date: " + d + "    Income: $" + income + "    Expense: $" + expense + "    Balance: $" + balance);
                transactionList.getChildren().add(row);
            }

        } catch (Exception e) {
            transactionList.getChildren().add(new Label("\u274C Error: " + e.getMessage()));
        }
    }

    private void exportToCSV(Stage stage) {
        String selected = monthSelector.getValue();
        if (selected == null) return;

        String[] parts = selected.split(" ");
        String month = parts[0].toUpperCase();
        int year = Integer.parseInt(parts[1]);

        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Save CSV File");
        fileChooser.setInitialFileName("overview-" + month + "-" + year + ".csv");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showSaveDialog(stage);

        if (file != null) {
            try (PrintWriter writer = new PrintWriter(file)) {
                writer.println("Date,Income,Expense,Balance");

                for (javafx.scene.Node node : transactionList.getChildren()) {
                    if (node instanceof Label) {
                        String text = ((Label) node).getText();
                        if (text.startsWith("Date:")) {
                            String[] partsText = text.split("\\s+");
                            String date = partsText[1];
                            String income = partsText[3].replace("$", "");
                            String expense = partsText[5].replace("$", "");
                            String balance = partsText[7].replace("$", "");
                            writer.printf("%s,%s,%s,%s\n", date, income, expense, balance);
                        }
                    }
                }

                transactionList.getChildren().add(new Label("\u2705 Exported to " + file.getName()));
            } catch (Exception ex) {
                transactionList.getChildren().add(new Label("\u274C Export failed: " + ex.getMessage()));
            }
        }
    }

    public static void main(String[] args) {
        // launch(args);
    }
}