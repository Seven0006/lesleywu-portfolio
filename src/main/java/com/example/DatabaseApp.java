// package com.example;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.sql.ResultSet;
// import java.sql.Statement;

// public class DatabaseApp {
//     public static void main(String[] args) {
//         String url = "jdbc:postgresql://my-postgres:5432/mydb";  // 数据库 URL
//         String user = "postgres";  // 数据库用户名
//         String password = "mysecretpassword";  // 数据库密码
        
//         try (Connection conn = DriverManager.getConnection(url, user, password)) {
//             Statement stmt = conn.createStatement();
//             ResultSet rs = stmt.executeQuery("SELECT * FROM users");
            
//             while (rs.next()) {
//                 System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name") + ", Email: " + rs.getString("email"));
//             }
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }
// }
package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.util.Scanner;

public class DatabaseApp {

    // Database credentials (adjust as needed for your environment)
    private static final String URL = "jdbc:postgresql://my-postgres:5432/mydb";
    private static final String USER = "postgres";
    private static final String PASSWORD = "mysecretpassword";

    public static void main(String[] args) {

        // 1) Create a Scanner to read from System.in
        Scanner in = new Scanner(System.in);

        // 2) Prompt the user
        System.out.println("Choose an option: ");
        System.out.println("1) Read all users");
        System.out.println("2) Insert a new user");
        System.out.print("Enter choice (1 or 2): ");

        // 3) Read the choice (numeric) 
        int choice = in.nextInt();
        in.nextLine(); // consume the newline left in the buffer

        // 4) Execute logic based on choice
        if (choice == 1) {
            // "READ" case
            readUsers();
        } else if (choice == 2) {
            // "INSERT" case
            System.out.print("Enter name: ");
            String name = in.nextLine();

            System.out.print("Enter email: ");
            String email = in.nextLine();

            insertUser(name, email);
        } else {
            System.out.println("Invalid choice. Please run again and pick 1 or 2.");
        }

        // 5) Close the Scanner
        in.close();
    }

    // ---------------------------
    // Reads and prints all rows from the 'users' table
    // ---------------------------
    private static void readUsers() {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM users");

            System.out.println("---- USERS TABLE ----");
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id")
                        + ", Name: " + rs.getString("name")
                        + ", Email: " + rs.getString("email"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ---------------------------
    // Inserts a new row into 'users' table
    // ---------------------------
    private static void insertUser(String name, String email) {
        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setString(2, email);
            int rowsInserted = pstmt.executeUpdate();

            if (rowsInserted > 0) {
                System.out.println("Inserted user: " + name + " (" + email + ")");
            } else {
                System.out.println("No rows inserted. Something went wrong.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
