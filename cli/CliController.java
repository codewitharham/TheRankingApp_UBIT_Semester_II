package cli;

import java.util.Scanner;
import cli.File.InputFile;
import cli.Teacher.Teacher;
import cli.Student.Student;

public class CliController {
    private InputFile fileHandler;
    private Scanner scanner;
    // MODIFIED: Use the correct filename provided.
    private static final String DATA_FILE = "cli\\data\\student_data.txt";
    // NEW: A simple, hardcoded password for the admin.
    private static final String ADMIN_PASSWORD = "admin123";

    public CliController() {
        this.fileHandler = new InputFile();
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        System.out.println("\nWelcome to the Student Ranking Portal.");
        
        // NEW: Role selection loop
        while (true) {
            System.out.println("\nSelect your role:");
            System.out.println("1. Admin");
            System.out.println("2. Student");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            String roleChoice = scanner.nextLine();
            switch (roleChoice) {
                case "1":
                    if (handleAdminLogin()) {
                        showAdminMenu();
                    }
                    break;
                case "2":
                    showStudentMenu();
                    break;
                case "3":
                    System.out.println("Exiting Portal. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid choice. Please enter 1, 2, or 3.");
            }
        }
    }

    // NEW: Handles the admin login process.
    private boolean handleAdminLogin() {
        System.out.print("Enter admin password: ");
        String password = scanner.nextLine();
        if (ADMIN_PASSWORD.equals(password)) {
            System.out.println("Admin login successful!");
            return true;
        } else {
            System.out.println("Incorrect password. Access denied.");
            return false;
        }
    }

    // NEW: The menu specifically for Admins.
    private void showAdminMenu() {
        fileHandler.Read(DATA_FILE); // Load data once for the session
        while (true) {
            System.out.println("\n--- Admin Menu ---");
            System.out.println("1. Display all student records");
            System.out.println("2. Add a new record");
            System.out.println("3. Find a particular student record");
            System.out.println("4. Return to main menu");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    handleDisplayAllRecords();
                    break;
                case "2":
                    handleAddRecord();
                    break;
                case "3":
                    handleFindRecord();
                    break;
                case "4":
                    return; // Exits the admin menu and goes back to role selection
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }

    // NEW: The menu specifically for Students.
    private void showStudentMenu() {
        fileHandler.Read(DATA_FILE); // Load data once for the session
        while (true) {
            System.out.println("\n--- Student Menu ---");
            System.out.println("1. Find my record");
            System.out.println("2. Display OOPS Questions");
            System.out.println("3. Return to main menu");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    handleFindRecord();
                    break;
                case "2":
                    handleDisplayQuestions();
                    break;
                case "3":
                    return; // Exits the student menu and goes back to role selection
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }

    private void handleFindRecord() {
        System.out.print("Enter the student's seat number: ");
        String seatNumber = scanner.nextLine();
        
        // No need to re-read the file every time, it's loaded when the menu starts.
        Student student = fileHandler.findStudentBySeatNumber(seatNumber);
        
        if (student != null) {
            System.out.println("\n--- Student Found ---");
            System.out.println("Rank: " + student.getRank());
            System.out.println("Name: " + student.getName().replace("_", " "));
            System.out.println("Seat Number: " + student.getSeatNumber());
            System.out.println("Marks: " + student.getMarks());
            System.out.println("---------------------");
        } else {
            System.out.println("Student with seat number '" + seatNumber + "' not found.");
        }
    }

    private void handleDisplayAllRecords() {
        fileHandler.display();
    }

    private void handleAddRecord() {
        System.out.println("Enter new student data (e.g., '19 John_Doe B12345678910 0.0'):");
        System.out.print("Input: ");
        String input = scanner.nextLine();
        
        fileHandler.Write(DATA_FILE, input);
        
        // After adding, re-read and display to show the updated list
        System.out.println("Record added successfully. Here is the updated list:");
        fileHandler.Read(DATA_FILE);
        fileHandler.display();
    }
    
    private void handleDisplayQuestions() {
        Teacher teacher = new Teacher();
        teacher.displayQuestion();
    }
}