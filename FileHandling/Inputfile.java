import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Inputfile {
    private List<Student> sl = new ArrayList<>();

    public Inputfile() {

    }

    // It is a Write Function
    public void Write(String filename, String text) {
        try {
            /*  Here i have used true this true ensure that whatever user write will not
             overwrite the previous data  */
            FileWriter writer = new FileWriter(filename, true);

            writer.write(text + "\n");
            writer.close();

            System.out.println("Writing Done");

        } catch (IOException e) {
            System.out.println("error");
        }

    }

    // It is a Read Function
    public void Read() {
        int index = 0;
        String line[] = new String[1000];
        try {
            File obj = new File("Data.txt");
            Scanner n = new Scanner(obj);
            if (n.hasNextLine()) {
                n.nextLine(); // skip the first line (header)
            }
            while (n.hasNextLine()) {
                line[index] = n.nextLine();
                String[] d = line[index].split("\\s+");
                int rank = Integer.parseInt(d[0]);
                String name = d[1];
                String seatNumber = d[2];
                Double marks = Double.parseDouble(d[3]);
                sl.add(new Student(rank, name, seatNumber, marks));
                index++;
            }
            n.close();

        } catch (IOException e) {
            System.out.println("error");
        }
    }

    public void save() {

    }

    public void display() {
        System.out.println();
        for (int j = 0; j < sl.size(); j++) {
            System.out.println(sl.get(j));
        }
    }
}