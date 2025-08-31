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
                    System.out.println("Exiting Portal...");
                    return;
                default:
                    System.out.println("Invalid choice. Please enter 1, 2, or 3.");
            }
        }
    }

    private boolean handleAdminLogin() {
        System.out.print("\nEnter admin password: ");
        String password = scanner.nextLine();
        if (password.equals(ADMIN_PASSWORD)) {
            System.out.println("Login successful, Admin!");
            return true;
        } else {
            System.out.println("Incorrect password. Access denied.");
            return false;
        }
    }

    private void showAdminMenu() {
        while (true) {
            System.out.println("\n--- Admin Menu ---");
            System.out.println("1. Display All Records");
            System.out.println("2. Add New Student Record");
            System.out.println("3. Find Student by Seat Number");
            System.out.println("4. Exit to Role Selection");
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
                    handleFindStudent();
                    break;
                case "4":
                    System.out.println("Returning to role selection menu...");
                    return;
                default:
                    System.out.println("Invalid choice. Please enter a number from 1 to 4.");
            }
        }
    }

    private void showStudentMenu() {
        while (true) {
            System.out.println("\n--- Student Menu ---");
            System.out.println("1. Display All Records");
            System.out.println("2. Find My Record by Seat Number");
            System.out.println("3. View Teacher's Questions");
            System.out.println("4. Exit to Role Selection");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();
            switch (choice) {
                case "1":
                    handleDisplayAllRecords();
                    break;
                case "2":
                    handleFindStudent();
                    break;
                case "3":
                    handleViewQuestions();
                    break;
                case "4":
                    System.out.println("Returning to role selection menu...");
                    return;
                default:
                    System.out.println("Invalid choice. Please enter a number from 1 to 4.");
            }
        }
    }
    
    private void handleViewQuestions() {
        Teacher teacher = new Teacher();
        teacher.displayQuestion();
    }

    private void handleFindStudent() {
        System.out.print("Enter student seat number to find: ");
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
        fileHandler.Read(DATA_FILE);
        fileHandler.sortStudents();
        fileHandler.display();
    }

    private void handleAddRecord() {
        System.out.println("Enter new student data (e.g., '19 John_Doe B12345678910 0.0'):");
        System.out.print("Input: ");
        String input = scanner.nextLine();
        
        // Split the input and create a Student object
        String[] parts = input.split("\\s+");
        if (parts.length != 4) {
            System.out.println("Invalid input format. Please enter data in the format 'rank name seatNumber marks'.");
            return;
        }

        try {
            int rank = Integer.parseInt(parts[0]);
            String name = parts[1];
            String seatNumber = parts[2];
            double marks = Double.parseDouble(parts[3]);
            Student student = new Student(rank, name, seatNumber, marks);
            
            fileHandler.Write(DATA_FILE, student);
            
            // After adding, re-read and display to show the updated list
            System.out.println("Record added successfully. Here is the updated list:");
            fileHandler.Read(DATA_FILE);
            fileHandler.sortStudents();
            fileHandler.display();
        } catch (NumberFormatException e) {
            System.out.println("Invalid number format for rank or marks. Please try again.");
        }
    }
}
