import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

// --- SVG Icons (replaces react-icons) ---
const SchoolIcon = () => (
  <svg className="h-8 w-8 text-cyan-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 18.782V21M3 21v-2.218c0-1.02.6-1.938 1.5-2.457L12 14z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"/>
  </svg>
);

const UserIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
  </svg>
);

interface Student {
  rank: number;
  name: string;
  seatNumber: string;
  marks: number;
}

const StudentDetailsPage = () => {
  const [seatNumberInput, setSeatNumberInput] = useState("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [allStudents, setAllStudents] = useState<Student[]>([]);

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const ADMIN_PASSWORD_HARDCODED = "admin123";

  // --- Fetch all students ---
  const fetchAllStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v_1/ranking");
      setAllStudents(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch all students:", err);
      return [];
    }
  };

  // Polling every 10 seconds
  useEffect(() => {
    fetchAllStudents();
    const intervalId = setInterval(() => {
      fetchAllStudents();
    }, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  // --- Search student ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFoundStudent(null);

    if (!seatNumberInput.trim()) {
      setError("Please enter a seat number.");
      setLoading(false);
      return;
    }

    try {
      const students = await fetchAllStudents();
      const student = students.find(
        (s: Student) => s.seatNumber.toLowerCase() === seatNumberInput.trim().toLowerCase()
      );

      if (student) {
        setFoundStudent(student);
        // ✅ Removed auto PDF download — just show details
      } else {
        setError(`Student with seat number '${seatNumberInput}' not found.`);
      }
    } catch (err) {
      setError("Failed to retrieve data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- Teacher PDF (all students) ---
  const generatePDFTeacher = () => {
    const doc = new jsPDF();
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

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("student_ranking_report.pdf");
  };

  // --- Single student PDF ---
  const getRemarks = (marks: number): string => {
    if (marks >= 18) return "Excellent performance!";
    if (marks >= 15) return "Very Good";
    if (marks >= 12) return "Good, but can improve";
    if (marks >= 8) return "Needs improvement";
    return "Poor performance, needs serious effort";
  };

  const generateStudentPDF = (student: Student) => {
const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Student Report Card", 14, 20);

  // Collaborators
  doc.setFontSize(13);
  doc.setFont("times", "italic");
  doc.text("Prepared with collaboration by:", 14, 30);

  const collaborators = [
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
  autoTable(doc, {
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
  });

  // Remarks
  const finalY = (doc as any).lastAutoTable.finalY || 50;
  doc.setFontSize(18);
  doc.text("Remarks:", 14, finalY + 15);
  doc.setFontSize(13);
  doc.text(getRemarks(student.marks), 14, finalY + 25);

  // Save PDF
  doc.save(`${student.name}_report.pdf`);
  };

  // --- Admin dialog actions ---
  const handleGenerateAllStudentsClick = () => {
    setShowPasswordDialog(true);
  };

  const handleCloseDialog = () => {
    setShowPasswordDialog(false);
    setAdminPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === ADMIN_PASSWORD_HARDCODED) {
      generatePDFTeacher();
      handleCloseDialog();
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl">
        <div className="relative px-4 py-8 bg-white shadow-lg sm:rounded-3xl sm:p-12 transition-all duration-300">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-cyan-200 rounded-full flex items-center justify-center ring-4 ring-cyan-100">
                <SchoolIcon />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Find Your Result</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter your official seat number to view your marks.
                </p>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="py-8 space-y-4">
              <div className="flex flex-col">
                <label className="leading-loose">Seat Number</label>
                <div className="relative focus-within:text-gray-600 text-gray-400">
                  <UserIcon />
                  <input
                    type="text"
                    value={seatNumberInput}
                    onChange={(e) => setSeatNumberInput(e.target.value)}
                    className="pl-10 pr-4 py-2 border w-full sm:text-sm border-gray-300 rounded-md text-gray-600 focus:outline-none"
                    placeholder="e.g., B24110006086"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 flex justify-center items-center w-full text-white px-4 py-3 rounded-md transition-colors duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            {/* Results */}
            {error && (
              <div className="p-4 border rounded-lg bg-red-50 border-red-300 text-red-800 shadow-inner text-center">
                <p className="font-semibold">Search Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {foundStudent && (
              <div className="p-6 border-2 border-dashed rounded-lg bg-green-50 border-green-300 shadow-inner mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Result Found!</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex justify-between"><strong>Student Name:</strong> <span>{foundStudent.name}</span></p>
                  <p className="flex justify-between"><strong>Seat Number:</strong> <span>{foundStudent.seatNumber}</span></p>
                  <p className="flex justify-between"><strong>Marks:</strong> <span className="font-bold text-lg text-green-700">{foundStudent.marks}</span></p>
                  <p className="flex justify-between"><strong>Rank:</strong> <span className="font-bold text-lg text-green-700">{foundStudent.rank}</span></p>
                </div>
                <button
                  onClick={() => generateStudentPDF(foundStudent)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Generate Student PDF
                </button>
              </div>
            )}

            {/* Generate All Students Report (Admin Only) */}
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerateAllStudentsClick}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg"
              >
                Generate All Students Report
              </button>
            </div>

            {/* Password Dialog */}
            {showPasswordDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                  <h3 className="text-black text-lg font-semibold mb-4">Admin Verification</h3>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full border px-3 py-2 rounded mb-3"
                  />
                  {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
                  <div className="flex justify-end space-x-3">
                    <button onClick={handleCloseDialog} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handlePasswordSubmit} className="px-3 py-1 bg-blue-500 text-white rounded">Submit</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
