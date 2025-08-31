import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { MdHome, MdSupervisorAccount } from 'react-icons/md';
import "tailwindcss";
import "./../App.css"

const StudentDetailsPage = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    rollNumber: '',
    course: '',
    QuizMarks:'',
  });
  
  const [submittedData, setSubmittedData] = useState<any | null>(false);
  
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setStudentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v_1/ranking");
        console.log(response);
        setSubmittedData(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmittedData(studentData); // store submitted details
    console.log('Submitted student data:', studentData);
  };

  return (
       <div className="relative sm:max-w-xl sm:mx-auto w-full">
        <div className="relative px-4 py-4 bg-white shadow-lg sm:rounded-3xl sm:p-14 transition-all duration-300">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-cyan-200 rounded-full flex items-center justify-center">
                <IoMdSchool className="h-8 w-8 text-cyan-600" />
              </div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">Student Details</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Enter your academic information
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="divide-y divide-gray-200">
              <form
                onSubmit={handleSubmit}
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="leading-loose">Full Name</label>
                  <div className="relative focus-within:text-gray-600 text-gray-400">
                    <FaUser className="absolute left-3 top-2" />
                    <input
                      type="text"
                      value={studentData.name}
                      onChange={(e) => setStudentData({...studentData,name:e.target.value})}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Roll Number */}
                <div className="flex flex-col">
                  <label className="leading-loose">Seat Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={studentData.rollNumber}
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="B24110006###"
                  />
                </div>

                {/* Course */}
                <div className="flex flex-col">
                  <label className="leading-loose">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={studentData.course}
                    onChange={handleInputChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="CS-352 : Object Oriented Programming"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex items-center">
                  <button
                  onClick={fetchData}
                    type="submit"
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  >
                    Submit Details
                  </button>
                </div>
              </form>
            </div>

            {/* Submitted Data Section */}
            {submittedData && (
              <div className="mt-8 p-6 border rounded-lg bg-amber-500 shadow-inner">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Submitted Student Information:
                </h3>
                <p><strong>Full Name:</strong> {studentData.name}</p>
                <p><strong>Seat Number:</strong> {submittedData.rollNumber}</p>
                <p><strong>Course:</strong> {submittedData.course}</p>
                <p><strong>Your Quiz Marks:</strong> {submittedData.QuizMarks}</p>
                <p><strong>Your Quiz Marks:</strong> {submittedData.QuizMarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default StudentDetailsPage;
