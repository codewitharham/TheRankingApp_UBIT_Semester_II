import { useEffect, useState, type FC, type FormEvent } from "react";
// The following libraries are now loaded via script tags to resolve compilation errors
import jsPDF from "jspdf";
import axios from "axios";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
// import autoTable from "jspdf-autotable";

// --- SVG Icons ---
const StudentIcon: FC = () => (
  <svg className="h-8 w-8 text-cyan-50" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const UserIcon: FC = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const SearchIcon: FC = () => (
  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

// --- Types ---
interface Student {
  rank: number;
  name: string;
  seatNumber: string;
  marks: number;
}

// --- Component ---
const StudentDetailsPage: FC = () => {
  // Constants for the fixed part of the seat number
  const SEAT_NUMBER_PREFIX: string = "B24110006";

  // State for the user-editable part of the seat number
  const [seatNumberSuffix, setSeatNumberSuffix] = useState<string>("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const ADMIN_PASSWORD_HARDCODED = "admin123";
  // --- Fetch all students from mock data ---
  const fetchAllStudents = async () => {
    try { const response = await axios.get("/api/v_1/ranking");
    console.log(response);
    
    setAllStudents(response.data.data);
    return response.data.data; }
     
    catch (err) { console.error("Failed to fetch all students:", err); return []; }
  };

  // --- Fetch initial data on mount ---
  useEffect(() => {
    let isMounted: boolean = true;
    const initialStudents:any = fetchAllStudents();
    const initialSearchTerm: string = SEAT_NUMBER_PREFIX + seatNumberSuffix.trim();
    if (isMounted && initialSearchTerm.length > SEAT_NUMBER_PREFIX.length && initialStudents.length) {
      const s: Student | undefined = initialStudents.find(
        (x:any) => x.seatNumber?.toLowerCase() === initialSearchTerm.toLowerCase()
      );
      if (s) setFoundStudent(s);
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Search student ---
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFoundStudent(null);

    // Combine the prefix and the user input to get the full seat number
    const fullSeatNumber: string = SEAT_NUMBER_PREFIX + seatNumberSuffix.trim();

    if (fullSeatNumber.length <= SEAT_NUMBER_PREFIX.length) {
      setError("Please enter the remaining digits of your seat number.");
      setLoading(false);
      return;
    }

    try {
      const students:any = allStudents.length ? allStudents : fetchAllStudents();
      const student: Student | undefined = students.find(
        (s:any) => s.seatNumber?.toLowerCase() === fullSeatNumber.toLowerCase()
      );

      if (student) {
        setFoundStudent(student);
      } else {
        setError(`Student with seat number '${fullSeatNumber}' not found.`);
      }
    } catch (err) {
      setError("Failed to retrieve data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- PDF helpers ---
  const getRemarks = (marks: number): string => {
    if (marks >= 18) return "Excellent performance!";
    if (marks >= 15) return "Very Good";
    if (marks >= 12) return "Good, but can improve";
    if (marks >= 8) return "Needs improvement";
    return "Poor performance, needs serious effort";
  };

  const generatePDFTeacher = (): void => {
    const doc:any = new jsPDF();
    doc.setFontSize(18);
    doc.text("Student Ranking Report", 14, 15);

    const tableColumn = ["Ranking", "Student Name", "Seat Number", "Marks"];
    const tableRows: (string | number)[][] = [];

    allStudents.forEach((student) => {
      tableRows.push([
        student.rank,
        student.name.replace(/_/g, " "),
        student.seatNumber,
        student.marks,
      ]);
    });

    autoTable(doc,{
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    doc.save("student_ranking_report.pdf");
  };

  const generateStudentPDF = (student: Student) => {
    const doc:any = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Student Report Card", 14, 20);

    // Collaborators
    doc.setFontSize(13);
    doc.setFont("times", "italic");
    doc.text("Prepared with collaboration by:", 14, 30);

    const collaborators: string[] = [
      "Ahmed Abdul Rehman",
      "Muhammad Arham Jamil",
      "Muhammad Ahsan",
      "Shahdil Khizer",
      "Muneeb Ahmed Siddiqui",
      "Nida Hafeez",
    ];

    let y = 40;
    collaborators.forEach((name) => {
      doc.text(`• ${name}`, 20, y);
      y += 9;
    });

    // Student info table
    autoTable(doc,{
      startY: 90,
      head: [["Field", "Value"]],
      body: [
      ["Ranking", student.rank.toString()],
      ["Student Name", student.name.replace(/_/g, " ")],
      ["Seat Number", student.seatNumber],
      ["Marks (out of 20)", student.marks.toString()],
      ["Course Name", "CS-352 - Object Oriented Programming"],
      ["Teacher Name", "Miss Humera Tariq"],
    ],
      styles: { fontSize: 12, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    // Remarks
    const finalY = (doc as any).lastAutoTable?.finalY || 50;
    doc.setFontSize(18);
    doc.text("Remarks:", 14, finalY + 15);
    doc.setFontSize(13);
    doc.text(getRemarks(student.marks), 14, finalY + 25);
   // Save
    doc.save(`${student.name}_report.pdf`);
  };

  // --- Admin dialog actions ---
  const handleGenerateAllStudentsClick = (): void => {
    setShowPasswordDialog(true);
  };

  const handleCloseDialog = (): void => {
    setShowPasswordDialog(false);
    setAdminPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = (): void => {
    if (adminPassword === ADMIN_PASSWORD_HARDCODED) {
      generatePDFTeacher();
      handleCloseDialog();
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  // --- UI ---
  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script src="https://unpkg.com/jspdf-autotable@3.8.1/dist/jspdf.plugin.autotable.js"></script>
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl">
          {/* Decorative glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-300/30 to-fuchsia-300/30 blur-2xl -z-10" />

          {/* Card shell with glass effect */}
          <div className="relative px-6 py-10 sm:p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-cyan-600 shadow-lg ring-4 ring-cyan-100 flex items-center justify-center animate-pulse">
                  <StudentIcon />
                </div>
                <div className="pl-1">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-800">Find Your Result</h2>
                  <p className="text-sm text-gray-500">Enter your official seat number to view your marks.</p>
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSubmit} className="pt-8 pb-6  space-y-5">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">Seat Number</label>
                  <div className="relative flex group text-gray-400 focus-within:text-cyan-600">
                    <UserIcon />
                    {/* Fixed prefix */}
                    <div className="pl-10 pr-2 py-3 border w-auto border-r-0 rounded-l-xl text-gray-700 bg-gray-200/50 backdrop-blur-md flex items-center focus-within:ring-2 focus-within:ring-cyan-500 transition-all border-gray-300">
                      <span className="font-mono">{SEAT_NUMBER_PREFIX}-</span>
                    </div>
                    {/* User input field */}
                    <input
                      type="text"
                      value={seatNumberSuffix}
                      onChange={(e) => setSeatNumberSuffix(e.target.value)}
                      className="pr-4 pl-2 py-3 border w-full sm:text-sm rounded-r-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white/70 backdrop-blur-md border-gray-300"
                      placeholder="Enter rest of seat number"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center w-full gap-2 text-white font-semibold px-4 py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 hover:shadow-cyan-300/50 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon />
                      Search
                    </>
                  )}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div aria-live="polite" className="p-4 mb-3 border rounded-xl bg-red-50 border-red-200 text-red-700 shadow-inner text-center">
                  <p className="font-semibold">Search Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Result */}
              {foundStudent && (
                <div className="mt-2 mb-5
                ">
                  <div className="p-[1px] rounded-2xl bg-gradient-to-r from-green-300 via-emerald-300 to-green-300">
                    <div className="p-6 rounded-[1rem] bg-gradient-to-br from-green-50 to-green-100 border-2 border-dashed border-green-300 shadow-lg">
                      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">🎉 Result Found!</h3>
                      <div className="space-y-3 text-gray-700">
                        <p className="flex justify-between"><strong>Student Name:</strong> <span>{(foundStudent.name || "-").replace(/_/g, " ")}</span></p>
                        <p className="flex justify-between"><strong>Seat Number:</strong> <span className="font-mono">{foundStudent.seatNumber}</span></p>
                        <p className="flex justify-between"><strong>Marks:</strong> <span className="font-bold text-lg text-green-800 bg-green-200/70 px-2 py-0.5 rounded-lg animate-pulse">{foundStudent.marks}</span></p>
                        <p className="flex justify-between"><strong>Rank:</strong> <span className="font-bold text-lg text-green-800">{foundStudent.rank}</span></p>
                      </div>
                      <button
                        onClick={() => generateStudentPDF(foundStudent)}
                        className="mt-5 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]"
                      >
                        Generate Student PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerateAllStudentsClick}
                  className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                >
                  Generate All Students Report
                </button>
              </div>

              {/* Password Dialog */}
              {showPasswordDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 border border-gray-100">
    <h3 className="text-gray-800 text-lg font-bold mb-4">🔑 Admin Verification</h3>

    {/* Wrap everything in a form */}
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page reload
        handlePasswordSubmit(); // your function
      }}
    >
      <input
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="Enter admin password"
        className="text-gray-800 w-full border px-3 py-2 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
      />

      {passwordError && (
        <p className="text-red-500 text-sm mb-2">{passwordError}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCloseDialog}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</div>

              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailsPage;
