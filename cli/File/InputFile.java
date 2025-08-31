package cli.File;

import cli.Student.Student;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Scanner;

public class InputFile {
    private List<Student> students = new ArrayList<>();

    // Updated Write function to accept a Student object
    public void Write(String filename, Student student) {
        try (FileWriter writer = new FileWriter(filename, true)) {
            // Student ke data ko ek single line string mein format karein
            String data = String.format("%d %s %s %.2f", 
                student.getRank(), 
                student.getName().replace(" ", "_"), 
                student.getSeatNumber(), 
                student.getMarks());
            
            // Text ko Base64 mein encode karke new line ke saath file mein append karein
            String encodedText = Base64.getEncoder().encodeToString(data.getBytes());
            writer.write(encodedText + "\n");
            
            System.out.println("Writing Done");
        } catch (IOException e) {
            System.out.println("Error while writing to file: " + e.getMessage());
        }
    }

    // Read function: reads Base64-encoded lines and converts to Student objects
    public void Read(String filename) {
        students.clear(); // Clear previous data

        try (Scanner scanner = new Scanner(new File(filename))) {
            while (scanner.hasNextLine()) {
                String encodedLine = scanner.nextLine().trim();
                if (encodedLine.isEmpty()) continue;

                try {
                    // Decode Base64
                    byte[] decodedBytes = Base64.getDecoder().decode(encodedLine);
                    String line = new String(decodedBytes).trim();

                    // Split line into exactly 4 parts
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
                    // so we only need to catch one.
                    System.out.println("Skipping invalid line (parsing error): " + encodedLine);
                }
            }
        } catch (IOException e) {
            System.out.println("Error while reading file: " + e.getMessage());
        }
    }

    // Find a student by seat number
    public Student findStudentBySeatNumber(String seatNumber) {
        for (Student s : students) {
            if (s.getSeatNumber().equalsIgnoreCase(seatNumber)) {
                return s;
            }
        }
        return null;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return students;
    }

    // Display all students
    public void display() {
        if (students.isEmpty()) {
            System.out.println("\nNo student records to display.");
            return;
        }

        System.out.println("\n --------------------------------------------------------------");
        System.out.println("|             Current Student Rankings                         |");
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