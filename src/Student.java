public class Student {
    private String seatNumber;
    private String name;
    private double marks;
    private int rank;

    // Constructor
    public Student(String seatNumber, String name, double marks, int rank) {
        this.seatNumber = seatNumber;
        this.name = name;
        this.marks = marks;
        this.rank = rank;
    }
    // Get Student seatNumber
    public String getSeatNumber() {
        return this.seatNumber;
    }

    // Get Student name
    public String getName() {
        return this.name;
    }

    // Get Student marks
    public double getMarks() {
        return this.marks;
    }
    
    // Get Student rank
    public int getRank() {
        return this.rank;
    }
    
    // Set Student seatNumber
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    // Set Student name
    public void setName(String name) {
        this.name = name;
    }

    // Set Student marks
    public void setMarks(double marks) {
        this.marks = marks;
    }
    
    // Set Student rank
    public void setRank(int rank) {
        this.rank = rank;
    }

    @Override
    public String toString() {
        String format = "Student Details\n";
        format += "Seat Number : " + this.seatNumber;
        format += "\nName : " + this.name;
        format += "\nMarks : " + this.marks;
        format += "\nRank : " + this.rank;
        
        return format;
        
    }

    
}











