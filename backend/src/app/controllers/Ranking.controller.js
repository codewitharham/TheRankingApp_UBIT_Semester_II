// ranking controller to handle ranking related requests

import {promises as fs} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url';

// A helper function to parse student data from a line of text
const parseStudentData = (line) => {
    // Split the line by one or more spaces to get the individual data points
    const parts = line.split(/\s+/);
    if (parts.length >= 4) {
        return {
            rank: parseInt(parts[0], 10),
            name: parts[1].replace(/_/g, " "),
            seatNumber: parts[2],
            marks: parseFloat(parts[3]),
        };
    }
    return null; // Return null for invalid lines
};

const getRanking = async (req, res) => {
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dataFilePath = path.join(__dirname, '../../../../cli/data/student_data.txt');

    try {
        // Read the content of the Data.txt file asynchronously
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        
        // Split the content into an array of lines
        const lines = fileContent.trim().split('\n');

        // Check if the file is empty or only contains the header
        if (lines.length <= 1) {
            return res.status(200).json({ 
                message: "No student records found.",
                data: []
            });
        }
        
        // Map the lines to an array of student objects, skipping the header line
        const students = lines.slice(1)
            .map(parseStudentData)
            .filter(Boolean); // Filter out any null values from parsing invalid lines

        // Send the student data as a JSON response
        return res.status(200).json({
            message: "Student ranking data fetched successfully.",
            data: students
        });

    } catch (error) {
        // Handle any errors that occur during file reading or parsing
        console.error("Failed to read student data:", error);
        return res.status(500).json({
            message: "Internal server error: Could not retrieve ranking data."
        });
    }
};

export { getRanking };