//import java.util.ArrayList;
import java.util.Scanner;
//import java.io.File;
//import java.io.IOException;
public class Main{
    public static void main(String[] args) {
    
        // Create obj of File class
        Inputfile myfile=new Inputfile();            
        
        //Taking input
        Scanner n = new Scanner(System.in);
         
        // Checking if user want to write something in file
        
        System.out.println("\n if you  want to write something type w ");
        String check=n.nextLine();
        
        if(check.equals("w")) {
           System.out.println("Enter Text");
           String text=n.nextLine();
           myfile.Write("Data.txt",text);
        }
        else{
           System.out.println("Writer close");
        }
       
        myfile.Read(); 
        myfile.display();
       
        n.close();
    }
}                