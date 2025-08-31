import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../../../cli/data/student_data.txt');

// A helper function to decode and parse a single line of student data
const parseStudentData = (encodedLine) => {
    try {
        const decodedLine = Buffer.from(encodedLine, 'base64').toString('utf-8');
        const parts = decodedLine.trim().split(/\s+/);
        if (parts.length !== 4) {
            console.error("Skipping invalid line: " + decodedLine);
            return null;
        }

        return {
            rank: parseInt(parts[0], 10),
            name: parts[1].replace(/_/g, " "),
            seatNumber: parts[2],
            marks: parseFloat(parts[3]),
        };
    } catch (error) {
        console.error("Skipping invalid line (decoding error): " + encodedLine, error);
        return null;
    }
};

// @desc    Get all student rankings
// @route   GET /api/v_1/ranking
// @access  Public
const getRanking = asyncHandler(async (req, res) => {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const lines = fileContent.trim().split('\n');

        if (lines.length === 0) {
            throw new ApiError(404, "No student records found.");
        }

        const students = lines
            .map(parseStudentData)
            .filter(Boolean); // Filter out any null values

        // Since the data file now contains Base64 encoded data, the 'lines.slice(1)'
        // logic might be incorrect if the file has no header. The Java code
        // seems to be writing only data lines.
        // We will assume no header and process all lines.

        return res.status(200).json(
            new ApiResponse(200, students, "Student ranking data fetched successfully.")
        );
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new ApiError(404, "Student data file not found.");
        }
        throw new ApiError(500, "Internal server error: Could not retrieve ranking data.");
    }
});


// @desc    Add a new student record
// @route   POST /api/v_1/ranking
// @access  Private (e.g., admin role)
const addStudent = asyncHandler(async (req, res) => {
    const { rank, name, seatNumber, marks } = req.body;

    if (!rank || !name || !seatNumber || !marks) {
        throw new ApiError(400, "All fields (rank, name, seatNumber, marks) are required.");
    }

    // Format the student data string to match the Java CLI's output format
    const data = `${rank} ${name.replace(/\s/g, "_")} ${seatNumber} ${marks.toFixed(2)}`;
    
    // Encode the data to Base64
    const encodedData = Buffer.from(data).toString('base64');
    
    // Read the file to check for duplicates and get current students for rank check
    let fileContent = '';
    try {
        fileContent = await fs.readFile(dataFilePath, 'utf-8');
    } catch (err) {
        // If file doesn't exist, it's fine. We'll create it.
    }

    const lines = fileContent.trim().split('\n');
    const existingStudents = lines
        .map(parseStudentData)
        .filter(Boolean);

    // Check for duplicate seat numbers
    const isDuplicate = existingStudents.some(s => s.seatNumber === seatNumber);
    if (isDuplicate) {
        throw new ApiError(409, `Student with seat number '${seatNumber}' already exists.`);
    }

    try {
        // Append the new Base64-encoded record to the file with a newline
        await fs.appendFile(dataFilePath, `${encodedData}\n`, 'utf-8');
        
        const newStudent = { rank, name: name.replace(/\s/g, " "), seatNumber, marks };

        return res.status(201).json(
            new ApiResponse(201, newStudent, "Student record added successfully.")
        );
    } catch (error) {
        throw new ApiError(500, "Internal server error: Could not add student record.");
    }
});

export { getRanking, addStudent };