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
            FileWriter writer = new FileWriter(filename, true);
            writer.write("\n" + text); // Start new records on a new line
            writer.close();
        } catch (IOException e) {
            System.out.println("Error while writing to file: " + e.getMessage());
        }
    }

    // It is a Read Function
    public void Read(String filename) {
        students.clear();
        try {
            File obj = new File(filename);
            Scanner n = new Scanner(obj);
            if (n.hasNextLine()) {
                n.nextLine(); // Skip header
            }
            while (n.hasNextLine()) {
                String line = n.nextLine();
                if (line.trim().isEmpty()) continue; // Skip empty lines
                String[] d = line.split("\\s+");
                if (d.length >= 4) {
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

    public Student findStudentBySeatNumber(String seatNumber) {
        for (Student student : students) {
            if (student.getSeatNumber().equalsIgnoreCase(seatNumber)) {
                return student;
            }
        }
        return null;
    }

    public List<Student> getAllStudents() {
        return this.students;
    }

    // MODIFIED: This method now prints a much cleaner table.
    public void display() {
         if (students.isEmpty()) {
            System.out.println("\nNo student records to display.");
            return;
        }

        String border = "+-------+---------------------------+------------------+---------+";
        String header = "| Rank  | Name                      | Seat Number      | Marks   |";

        System.out.println("\n" + border);
        System.out.println("|                     Current Student Rankings                  |");
        System.out.println(border);
        System.out.println(header);
        System.out.println(border);
        
        for (Student student : students) {
            System.out.printf("| %-5d | %-25s | %-16s | %-7.2f |\n", 
                student.getRank(), 
                student.getName().replace("_", " "), 
                student.getSeatNumber(), 
                student.getMarks());
        }
        
        System.out.println(border + "\n");
    }
}