package cli;

import java.util.Scanner;
import cli.File.InputFile;
import cli.Student.Student;
import cli.Teacher.Teacher; 
import java.util.Base64;

public class CliController {
    private final InputFile fileHandler;
    private final Scanner scanner;
    private static final String DATA_FILE = "data/student_data.txt"; 
    private static final String ADMIN_USERNAME = "admin";
    // Base64 encoded password for "admin123"
    private static final String ADMIN_PASSWORD_ENCODED = "YWRtaW4xMjM=";

    public CliController() {
        this.fileHandler = new InputFile();
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        System.out.println("\nWelcome to the Ranking App CLI.");
        fileHandler.Read(DATA_FILE);

        while (true) {
            System.out.println("\nSelect an option:");
            System.out.println("1. Login as Admin");
            System.out.println("2. Continue as User");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    if (handleAdminLogin()) {
                        showAdminMenu();
                    }
                    break;
                case "2":
                    showUserMenu();
                    break;
                case "3":
                    System.out.println("Exiting CLI. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid choice. Please enter 1, 2, or 3.");
            }
        }
    }

    private boolean handleAdminLogin() {
        System.out.print("Enter Admin Username: ");
        String username = scanner.nextLine();
        System.out.print("Enter Admin Password: ");
        String password = scanner.nextLine();

        // Decode the stored Base64 password for comparison
        String decodedPassword = new String(Base64.getDecoder().decode(ADMIN_PASSWORD_ENCODED));
        
        if (username.equals(ADMIN_USERNAME) && password.equals(decodedPassword)) {
            System.out.println("Admin login successful!");
            return true;
        } else {
            System.out.println("Invalid username or password. Please try again.");
            return false;
        }
    }

    private void showAdminMenu() {
        while(true) {
            System.out.println("\n--- Admin Menu ---");
            System.out.println("1. Find a particular student record");
            System.out.println("2. Display all student records");
            System.out.println("3. Add a new record");
            System.out.println("4. Display OOPS Questions");
            System.out.println("5. Logout");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1": handleFindRecord(); break;
                case "2": handleDisplayAllRecords(); break;
                case "3": handleAddRecord(); break;
                case "4": handleDisplayQuestions(); break;
                case "5": System.out.println("Logging out from Admin account."); return;
                default: System.out.println("Invalid choice. Please enter a number from 1 to 5.");
            }
        }
    }

    private void showUserMenu() {
        while(true) {
            System.out.println("\n--- User Menu ---");
            System.out.println("1. Find a particular student record");
            System.out.println("2. Display all student records");
            System.out.println("3. Back to main menu");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1": handleFindRecord(); break;
                case "2": handleDisplayAllRecords(); break;
                case "3": return;
                default: System.out.println("Invalid choice. Please enter a number from 1 to 3.");
            }
        }
    }

    private void handleFindRecord() {
        System.out.print("Enter student's seat number: ");
        String seat = scanner.nextLine();
        fileHandler.Read(DATA_FILE); 
        Student s = fileHandler.findStudentBySeatNumber(seat);
        if (s != null) {
            System.out.println("\n--- Student Found ---");
            System.out.println("Rank: " + s.getRank());
            System.out.println("Name: " + s.getName().replace("_", " "));
            System.out.println("Seat Number: " + s.getSeatNumber());
            System.out.println("Marks: " + s.getMarks());
        } else {
            System.out.println("Student not found.");
        }
    }

    private void handleDisplayAllRecords() {
        fileHandler.Read(DATA_FILE);
        fileHandler.display();
    }

    private void handleAddRecord() {
        System.out.println("\n--- Add New Student Record ---");
        try {
            System.out.print("Enter Rank: ");
            int rank = Integer.parseInt(scanner.nextLine());
            System.out.print("Enter Name (use underscores for spaces, e.g., 'John_Doe'): ");
            String name = scanner.nextLine();
            System.out.print("Enter Seat Number: ");
            String seatNumber = scanner.nextLine();
            System.out.print("Enter Marks: ");
            double marks = Double.parseDouble(scanner.nextLine());

            Student newStudent = new Student(rank, name, seatNumber, marks);
            fileHandler.Write(DATA_FILE, newStudent);
            System.out.println("New record added successfully.");
        } catch (NumberFormatException e) {
            System.out.println("Invalid input. Please enter a number for Rank and Marks.");
        }
    }

    private void handleDisplayQuestions() {
        Teacher teacher = new Teacher();
        teacher.displayQuestion();
    }
}