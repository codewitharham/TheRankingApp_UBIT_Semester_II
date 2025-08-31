package cli.Student;

import java.util.ArrayList;
import java.util.List;

public class StudentList {
    private List<Student> students;

    // Constructor
    public StudentList() {
        students = new ArrayList<>();
    }

    // Add student
    public void addStudent(Student student) {
        students.add(student);
    }

    // Get student by SeatNumber
    public Student getStudent(String seatNumber) {
        for (Student student : students) {
            if (student.getSeatNumber().equals(seatNumber)) {
                return student;
            }
        }
        return null;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return this.students;
    }

}
