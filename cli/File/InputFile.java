package cli.File;

import cli.Student.Student;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Scanner;
import java.util.Comparator;

/**
 * Handles all file I/O operations for student data.
 * This class is responsible for reading and writing Base64-encoded student records
 * to and from a specified file. It also provides methods to manage the in-memory
 * list of students.
 */
public class InputFile {
    private List<Student> students = new ArrayList<>();

    /**
     * Writes a new student record to the file, encoding it in Base64.
     * The record is appended to the end of the file.
     * @param filename The name of the file to write to.
     * @param student The Student object to be written.
     */
    public void Write(String filename, Student student) {
        try (FileWriter writer = new FileWriter(filename, true)) {
            
            // Format the student data into a single string.
            String data = String.format("%d %s %s %.2f", 
                student.getRank(), 
                student.getName().replace(" ", "_"), 
                student.getSeatNumber(), 
                student.getMarks());
            
            // Encode the data to Base64 before writing to the file.
            String encodedData = Base64.getEncoder().encodeToString(data.getBytes());
            writer.write(encodedData + "\n");
            
            System.out.println("Writing Done");
        } catch (IOException e) {
            System.out.println("Error while writing to file: " + e.getMessage());
        }
    }

    /**
     * Reads all Base64-encoded lines from the file, decodes them,
     * and populates the in-memory list of students.
     * @param filename The name of the file to read from.
     */
    public void Read(String filename) {
        students.clear(); // Clear previous data

        try (Scanner scanner = new Scanner(new File(filename))) {
            while (scanner.hasNextLine()) {
                String encodedLine = scanner.nextLine().trim();
                if (encodedLine.isEmpty()) continue;

                try {
                    // Decode the Base64 string to get the original data.
                    byte[] decodedBytes = Base64.getDecoder().decode(encodedLine);
                    String line = new String(decodedBytes).trim();

                    // Split the line into exactly 4 parts.
                    String[] parts = line.split("\\s+");
                    if (parts.length != 4) {
                        System.out.println("Skipping invalid line: " + line);
                        continue;
                    }

                    int rank = Integer.parseInt(parts[0]);
                    String name = parts[1];
                    String seatNumber = parts[2];
                    double marks = Double.parseDouble(parts[3]);

                    students.add(new Student(rank, name, seatNumber, marks));
                    
                } catch (IllegalArgumentException e) {
                    // NumberFormatException is a subclass of IllegalArgumentException,
                    // so this catches both Base64 decoding and number parsing errors.
                    System.out.println("Skipping invalid line (parsing error): " + encodedLine);
                }
            }
        } catch (IOException e) {
            System.out.println("Error while reading file: " + e.getMessage());
        }
    }

    /**
     * Finds a student in the in-memory list by their seat number.
     * @param seatNumber The seat number to search for.
     * @return The Student object if found, otherwise null.
     */
    public Student findStudentBySeatNumber(String seatNumber) {
        for (Student s : students) {
            if (s.getSeatNumber().equalsIgnoreCase(seatNumber)) {
                return s;
            }
        }
        return null;
    }
    
    /**
     * Sorts the list of students by their marks in descending order.
     */
    public void sortStudents() {
        students.sort(new Comparator<Student>() {
            @Override
            public int compare(Student s1, Student s2) {
                // Sort by marks in descending order
                int marksComparison = Double.compare(s2.getMarks(), s1.getMarks());
                if (marksComparison != 0) {
                    return marksComparison;
                }
                // If marks are equal, sort by rank in ascending order
                return Integer.compare(s1.getRank(), s2.getRank());
            }
        });
    }

    /**
     * Displays all student records in a formatted table.
     */
    public void display() {
        if (students.isEmpty()) {
            System.out.println("\nNo student records to display.");
            return;
        }

        System.out.println("\n --------------------------------------------------------------");
        System.out.println("|                      Current Student Rankings                    |");
        System.out.println("---------------------------------------------------------------");
        System.out.printf("| %-5s | %-25s | %-15s | %-6s |\n", "Rank", "Name", "Seat Number", "Marks");
        System.out.println("--------------------------------------------------------------");

        for (Student s : students) {
            System.out.printf("| %-5d | %-25s | %-15s | %-6.2f |\n",
                    s.getRank(),
                    s.getName().replace("_", " "),
                    s.getSeatNumber(),
                    s.getMarks());
        }

        System.out.println("---------------------------------------------------------------\n");
    }
}
