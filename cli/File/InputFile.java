package cli.File;

import cli.Student.Student;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class InputFile {
    private List<Student> students = new ArrayList<>();

    // It is a Write Function
    public void Write(String filename, String text) {
        try {
            /*
             * Here I have used 'true' to ensure that new data is appended and doesn't
             * overwrite the previous data.
             */
            FileWriter writer = new FileWriter(filename, true);
            writer.write(text + "\n");
            writer.close();
            System.out.println("Writing Done");
        } catch (IOException e) {
            System.out.println("Error while writing to file: " + e.getMessage());
        }
    }

    // It is a Read Function
    public void Read(String filename) {
        // Clear the previous data before reading to avoid duplicates
        students.clear();

        try {
            File obj = new File(filename);
            Scanner n = new Scanner(obj);

            // Skip the first line (header) if it exists
            if (n.hasNextLine()) {
                n.nextLine();
            }

            while (n.hasNextLine()) {
                String line = n.nextLine();
                // Use a regular expression to handle multiple spaces between fields
                String[] d = line.split("\\s+");
                if (d.length >= 4) { // Ensure there are at least 4 parts
                    try {
                        int rank = Integer.parseInt(d[0]);
                        String name = d[1];
                        String seatNumber = d[2];
                        double marks = Double.parseDouble(d[3]);
                        students.add(new Student(rank, name, seatNumber, marks));
                    } catch (NumberFormatException e) {
                        System.out.println("Skipping invalid line: " + line);
                    }
                }
            }
            n.close();
        } catch (IOException e) {
            System.out.println("Error while reading file: " + e.getMessage());
        }
    }

    // Method to find a student by seat number
    public Student findStudentBySeatNumber(String seatNumber) {
        for (Student student : students) {
            if (student.getSeatNumber().equalsIgnoreCase(seatNumber)) {
                return student;
            }
        }
        return null; // Return null if the student is not found
    }

    // Method to get all students
    public List<Student> getAllStudents() {
        return this.students;
    }

    // Displays all students
    public void display() {
        System.out.println("\n---------------------------------------------------------");
        System.out.println("|               Current Student Rankings                |");
        System.out.println("---------------------------------------------------------");
        System.out.printf("| %-5s | %-20s | %-15s | %-6s |\n", "Rank", "Name", "Seat Number", "Marks");
        System.out.println("---------------------------------------------------------");
        
        for (Student student : students) {
            System.out.printf("| %-5d | %-20s | %-15s | %-6.2f |\n", 
                student.getRank(), 
                student.getName().replace("_", " "), 
                student.getSeatNumber(), 
                student.getMarks());
        }
        
        System.out.println("---------------------------------------------------------\n");
    }
}
