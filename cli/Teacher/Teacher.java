package cli.Teacher;
import java.util.List;
import java.util.ArrayList;


public class Teacher {

     private List<String> questions;

    public Teacher() {
        questions = new ArrayList<>();

        questions.add("Write down your GitHub account name and also list down the name of the classes which you have really practiced.");
        questions.add("Write down the difference between shallow copy and deep copy, support your explanation with code.");
        questions.add("Draw the uml of RationalNumber class or Vector2D class.");
        questions.add("Write down the code of the uml which you have draw in Q:03 and also show in main class.");
        questions.add("What is overriding?.Give example of clone() overriding and toString() overriding in code.");
    }
    public void displayQuestion(){
        System.out.println("....QUESTIONS FROM THE OOPS MID....\n");
        for(String q : questions){
            System.out.println("QUES: "+q);
        }
    }
    
}
