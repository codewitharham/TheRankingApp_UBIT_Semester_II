package cli;

import java.util.Scanner;
import cli.File.InputFile;
import cli.Student.Student;

public class CliController {
    private InputFile fileHandler;
    private Scanner scanner;
    private static final String DATA_FILE = "D:\\TheRankingApp_UBIT_SemesterII\\cli\\data\\student_data.txt";

    public CliController() {
        this.fileHandler = new InputFile();
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        System.out.println("\nWelcome to the Ranking App CLI.");
        
        // Read data once at the start
        fileHandler.Read(DATA_FILE);
        
        while (true) {
            System.out.println("\nSelect an option:");
            System.out.println("1. Find a particular student record");
            System.out.println("2. Display all student records");
            System.out.println("3. Add a new record");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");

            // Use a try-catch to handle non-integer input
            int choice = -1;
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number from 1 to 4.");
                continue;
            }

            switch (choice) {
                case 1:
                    handleFindRecord();
                    break;
                case 2:
                    handleDisplayAllRecords();
                    break;
                case 3:
                    handleAddRecord();
                    break;
                case 4:
                    System.out.println("Exiting CLI. Goodbye!");
                    scanner.close();
                    return; // Exit the start method
                default:
                    System.out.println("Invalid choice. Please try again.");
                    break;
            }
        }
    }

    private void handleFindRecord() {
        System.out.print("Enter the student's seat number: ");
        String seatNumber = scanner.nextLine();
        
        // Re-read the data to ensure it's up to date before searching
        fileHandler.Read(DATA_FILE);
        Student student = fileHandler.findStudentBySeatNumber(seatNumber);
        
        if (student != null) {
            System.out.println("\n--- Student Found ---");
            System.out.println("Rank: " + student.getRank());
            System.out.println("Name: " + student.getName());
            System.out.println("Seat Number: " + student.getSeatNumber());
            System.out.println("Marks: " + student.getMarks());
            System.out.println("---------------------");
        } else {
            System.out.println("Student with seat number " + seatNumber + " not found.");
        }
    }

    private void handleDisplayAllRecords() {
        // Re-read the data to ensure it's up to date
        fileHandler.Read(DATA_FILE);
        fileHandler.display();
    }

    private void handleAddRecord() {
        System.out.println("Enter new student data (e.g., '1 John_Doe B1234 85.5'):");
        System.out.print("Input: ");
        String input = scanner.nextLine();
        
        // Write the new data to the file
        fileHandler.Write(DATA_FILE, input);
        
        // After adding, re-read and display to show the updated list
        fileHandler.Read(DATA_FILE);
        fileHandler.display();
    }
}
