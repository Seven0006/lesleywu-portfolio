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
import java.sql.Date;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

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
        scrollPane.setPrefHeight(300);

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

        Scene scene = new Scene(root, 700, 500);
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

        String sql = "SELECT id, date, category, amount, type FROM transactions " +
                     "WHERE user_id = ? AND EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ? " +
                     "ORDER BY date DESC, id";

        double totalIncome = 0;
        double totalExpense = 0;

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, currentUser.getId());
            stmt.setInt(2, Month.valueOf(month).getValue());
            stmt.setInt(3, year);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                LocalDate date = rs.getDate("date").toLocalDate();
                String category = rs.getString("category");
                String type = rs.getString("type");
                double amount = rs.getDouble("amount");

                String text = String.format("📅 %s | 💬 %s | 💵 $%.2f | 🏷 %s",
                        date, type, amount, category);
                Label row = new Label(text);

                Button editBtn = new Button("Edit");
                Button deleteBtn = new Button("Delete");
                HBox rowBox = new HBox(10, row, editBtn, deleteBtn);
                rowBox.setAlignment(Pos.CENTER_LEFT);

                editBtn.setOnAction(e -> showEditDialog(id, amount, category, type, date));
                deleteBtn.setOnAction(e -> {
                    deleteTransaction(id);
                    updateTransactionList();
                });

                transactionList.getChildren().add(rowBox);

                if ("income".equalsIgnoreCase(type)) totalIncome += amount;
                else totalExpense += amount;
            }

            double balance = totalIncome - totalExpense;
            Label summary = new Label("📊 Total Income: $" + totalIncome + "   Total Expense: $" + totalExpense + "   Balance: $" + balance);
            summary.setStyle("-fx-font-weight: bold;");
            transactionList.getChildren().add(new Separator());
            transactionList.getChildren().add(summary);

        } catch (Exception e) {
            transactionList.getChildren().add(new Label("❌ Error: " + e.getMessage()));
        }
    }

    private void showEditDialog(int id, double amount, String category, String type, LocalDate date) {
        Dialog<ButtonType> dialog = new Dialog<>();
        dialog.setTitle("Edit Transaction");

        ComboBox<String> typeBox = new ComboBox<>();
        typeBox.getItems().addAll("income", "expense");
        typeBox.setValue(type);

        ComboBox<String> categoryBox = new ComboBox<>();
        categoryBox.getItems().addAll("Food", "Shopping", "Car", "Rent", "Salary", "Transportation",
                                      "Sport", "Entertainment", "Travel", "Health", "Utilities", "Gift",
                                      "Education", "Investment", "Other");
        categoryBox.setValue(category);

        TextField amountField = new TextField(String.valueOf(amount));
        DatePicker datePicker = new DatePicker(date);

        GridPane grid = new GridPane();
        grid.setVgap(10);
        grid.setHgap(10);
        grid.setPadding(new Insets(10));
        grid.addRow(0, new Label("Type:"), typeBox);
        grid.addRow(1, new Label("Category:"), categoryBox);
        grid.addRow(2, new Label("Amount:"), amountField);
        grid.addRow(4, new Label("Date:"), datePicker);

        dialog.getDialogPane().setContent(grid);
        dialog.getDialogPane().getButtonTypes().addAll(ButtonType.OK, ButtonType.CANCEL);

        dialog.setResultConverter(button -> {
            if (button == ButtonType.OK) {
                try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                     PreparedStatement stmt = conn.prepareStatement(
                         "UPDATE transactions SET type = ?, category = ?, amount = ?, date = ? WHERE id = ?")) {

                    stmt.setString(1, typeBox.getValue());
                    stmt.setString(2, categoryBox.getValue());
                    stmt.setDouble(3, Double.parseDouble(amountField.getText().trim()));
                    stmt.setDate(4, Date.valueOf(datePicker.getValue()));
                    stmt.setInt(5, id);
                    stmt.executeUpdate();
                } catch (Exception ex) {
                    showAlert("❌ Edit Failed", ex.getMessage());
                }
            }
            return null;
        });

        dialog.showAndWait();
    }

    private void deleteTransaction(int id) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM transactions WHERE id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (Exception e) {
            showAlert("❌ Delete Failed", e.getMessage());
        }
    }

    private void exportToCSV(Stage stage) {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Save CSV File");
        fileChooser.setInitialFileName("overview.csv");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showSaveDialog(stage);

        if (file != null) {
            try (PrintWriter writer = new PrintWriter(file)) {
                writer.println("Date,Type,Amount,Category");
                for (javafx.scene.Node node : transactionList.getChildren()) {
                    if (node instanceof HBox) {
                        HBox rowBox = (HBox) node;
                        for (javafx.scene.Node item : rowBox.getChildren()) {
                            if (item instanceof Label) {
                                Label label = (Label) item;
                                if (label.getText().startsWith("📅")) {
                                String line = label.getText().replace("📅 ", "")
                                        .replace("💬 ", "")
                                        .replace("💵 $", "")
                                        .replace("🏷 ", "")
                                        .replace("📝 ", "")
                                        .replace(" | ", ",");
                                writer.println(line);
                            }
                        }
                    }
                }
            }
         } catch (Exception ex) {
                showAlert("❌ Export Failed", ex.getMessage());
            }
        }
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        // launch(args);
    }
}
