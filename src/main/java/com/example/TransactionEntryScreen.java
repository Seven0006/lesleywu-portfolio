package com.example;

import javafx.geometry.*;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import java.sql.*;
import java.time.LocalDate;

public class TransactionEntryScreen {

    private final User currentUser;

    public TransactionEntryScreen(User user) {
        this.currentUser = user;
    }

    public void show() {
        Stage stage = new Stage();
        stage.setTitle("Transaction Entry");

        Label title = new Label("Transaction Entry");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");

        // Date picker (default to today but user can change)
        Label dateLabel = new Label("Date:");
        DatePicker datePicker = new DatePicker(LocalDate.now());

        // choice of income or expense
        Label typeLabel = new Label("Type:");
        ToggleGroup typeGroup = new ToggleGroup();
        RadioButton incomeRadio = new RadioButton("Income");
        RadioButton expenseRadio = new RadioButton("Expense");
        incomeRadio.setToggleGroup(typeGroup);
        expenseRadio.setToggleGroup(typeGroup);
        HBox typeBox = new HBox(10, incomeRadio, expenseRadio);

        // category selection
        Label categoryLabel = new Label("Category:");
        ComboBox<String> categoryBox = new ComboBox<>();
        categoryBox.getItems().addAll(
                "Food", "Shopping", "Car", "Rent", "Salary", "Transportation",
                "Sport", "Entertainment", "Travel", "Health", "Utilities", "Gift",
                "Education", "Investment", "Other"
        );

        // Note input (optional)
        Label noteLabel = new Label("Note (optional):");
        TextField noteField = new TextField();

        // amount input
        Label amountLabel = new Label("Amount:");
        TextField amountField = new TextField();

        // buttons
        Button saveBtn = new Button("Save");
        Button editBtn = new Button("Edit");
        Button cancelBtn = new Button("Cancel");

        // disable editing initially
        categoryBox.setDisable(true);
        noteField.setEditable(false);
        amountField.setEditable(false);
        incomeRadio.setDisable(true);
        expenseRadio.setDisable(true);
        datePicker.setDisable(true);

        // Edit → buttons enabled
        editBtn.setOnAction(e -> {
            incomeRadio.setDisable(false);
            expenseRadio.setDisable(false);
            categoryBox.setDisable(false);
            noteField.setEditable(true);
            amountField.setEditable(true);
            datePicker.setDisable(false);
        });

        // Save → to database
        saveBtn.setOnAction(e -> {
            String type = incomeRadio.isSelected() ? "income" :
                          expenseRadio.isSelected() ? "expense" : null;

            String category = categoryBox.getValue();
            String noteText = noteField.getText().trim();
            String amountText = amountField.getText().trim();
            LocalDate date = datePicker.getValue();

            if (type == null || category == null || amountText.isEmpty() || date == null) {
                showAlert("Error", "Please fill all required fields.");
                return;
            }

            double amount;
            try {
                amount = Double.parseDouble(amountText);
            } catch (NumberFormatException ex) {
                showAlert("Error", "Invalid amount.");
                return;
            }

            // insert transaction into database
            boolean success = insertTransaction(currentUser.getId(), amount, category, type, date, noteText);
            if (success) {
                showAlert("Success", "Transaction saved.");
                stage.close();
            } else {
                showAlert("Error", "Failed to save transaction.");
            }
        });

        cancelBtn.setOnAction(e -> stage.close());

        // layout
        GridPane grid = new GridPane();
        grid.setVgap(10);
        grid.setHgap(10);
        grid.setAlignment(Pos.CENTER);
        grid.add(dateLabel, 0, 0);
        grid.add(datePicker, 1, 0);
        grid.add(typeLabel, 0, 1);
        grid.add(typeBox, 1, 1);
        grid.add(categoryLabel, 0, 2);
        grid.add(categoryBox, 1, 2);
        grid.add(noteLabel, 0, 3);
        grid.add(noteField, 1, 3);
        grid.add(amountLabel, 0, 4);
        grid.add(amountField, 1, 4);

        HBox buttons = new HBox(15, saveBtn, editBtn, cancelBtn);
        buttons.setAlignment(Pos.CENTER);

        VBox root = new VBox(20, title, grid, buttons);
        root.setPadding(new Insets(30));
        root.setAlignment(Pos.CENTER);

        Scene scene = new Scene(root, 500, 360);
        stage.setScene(scene);
        stage.show();
    }

    private boolean insertTransaction(int userId, double amount, String category, String type, LocalDate date, String note) {
        String sql = "INSERT INTO transactions (user_id, amount, category, type, date) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/mydb", "postgres", "mysecretpassword");
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setDouble(2, amount);
            stmt.setString(3, category);
            stmt.setString(4, type);
            stmt.setDate(5, Date.valueOf(date));
            stmt.executeUpdate();
            return true;

        } catch (Exception e) {
            System.out.println("❌ Insert failed: " + e.getMessage());
            return false;
        }
    }

    private void showAlert(String title, String msg) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(msg);
        alert.showAndWait();
    }
} 
