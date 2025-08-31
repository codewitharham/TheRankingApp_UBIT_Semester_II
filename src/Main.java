
public class Main 
{
	public static void main(String[] args) 
	{
        //	Testing Student Code
		Student s1 = new Student("B24110006102", "Shahdil", 21, 1);
        // Testing Student Methods		
		s1.setSeatNumber("B24110006102");
		s1.setName("Shahdil Khizer");
		s1.setMarks(21);
		s1.setRank(1);
		System.out.println(s1);
		
		//	Testing StudentList Code
		StudentList sl = new StudentList();
		sl.addStudent(s1);
	}
}