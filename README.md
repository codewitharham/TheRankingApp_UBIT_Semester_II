# The Student Ranking App

A full-stack application using JAVA OOPs Principles for managing and displaying student rankings. The project consists of a RESTful API built with Node.js and Express, a modern React frontend for searching student records, and a complementary Java-based Command Line Interface (CLI) for adding and viewing student data.

# This project was collaboratively developed by:
# - Muhammad Arham Jamil ( B24110006086 ) (https://github.com/codewitharham)
# - Ahmed Abdul Rehman ( B24110006014 ) (https://github.com/CodingatAhmed)
# - Nida Hafeez ( B24110006115 ) (https://github.com/nida179)
# - Shahdil Khizer ( B24110006102 ) (https://github.com/shahdilkhizer)
# - Muhammad Ahsan ( B24110006082 ) (https://github.com/muneeb-ahmed-siddiqui)
# - Muneeb Ahmed Siddiqui ( B24110006111 ) (https://github.com/Ahsan-05)
-----

## ✨ Features

  - **Dynamic Frontend:** A React-based web interface where students can search for their marks and ranking using their seat number.
  - **Real-Time Data Sync:** The frontend uses a polling mechanism to automatically fetch the latest student ranking data every 10 seconds, ensuring it stays synchronized with any changes made by the CLI.
  - **RESTful API:** A robust Node.js and Express backend that provides a single endpoint for retrieving all student ranking data in JSON format.
  - **CLI for Administration:** A Java CLI application for administrators to manage student records. It allows for viewing all records and adding new student data directly to the data file.
  - **Decoupled Architecture:** The CLI and web applications are fully independent but communicate through a shared data file, demonstrating a simple yet effective way to integrate a CLI with a frontend.

-----

## 💻 Technologies Used

### Backend (Node.js)

  - **Node.js:** The JavaScript runtime environment.
  - **Express.js:** A fast, minimalist web framework for building the API.
  - **CORS:** Middleware to enable cross-origin resource sharing.
  - **dotenv:** To manage environment variables.

### Frontend (React)

  - **React:** A JavaScript library for building user interfaces.
  - **TypeScript:** A typed superset of JavaScript that adds type safety.
  - **Axios:** A promise-based HTTP client for making API requests.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

### CLI + OOPS (Java)

  - **Java:** The core programming language for the CLI application.
  - **Maven:** (Assumed) A build automation tool for Java projects.

-----

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

  - Node.js (v18 or higher)
  - npm (Node Package Manager)
  - Java Development Kit (JDK 11 or higher)
  - Git

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/TheRankingApp_UBIT_SemesterII.git
    cd TheRankingApp_UBIT_SemesterII
    ```

2.  **Set up the Backend:**
    Navigate to the project's root directory and install the dependencies.

    ```bash
    npm install
    ```

    Create a `.env` file in the root directory and add the following:

    ```
    PORT=5000
    HOST=http://localhost:5000
    ```

    Start the backend server:

    ```bash
    npm start
    ```

    The server will be running on `http://localhost:5000`.

3.  **Set up the Frontend:**
    Open a new terminal, navigate to the `frontend` directory, and install the dependencies.

    ```bash
    cd frontend
    npm install
    ```

    Start the React development server:

    ```bash
    npm start
    ```

    The web application will open in your browser, typically at `http://localhost:3000`.

4.  **Set up the CLI:**
    Navigate to the root directory where the Java files are located. You will need a Java IDE like VS Code, IntelliJ IDEA, or Eclipse to compile and run the application.

      - **With an IDE:** Open the project, and run the `Main.java` file.
      - **From the command line (if you have the JDK installed):**
        ```bash
        # Compile the Java files
        javac -d . cli\*.java cli\File\*.java cli\Student\*.java cli\Teacher\*.java

        # Run the main class
        java cli.Main
        ```

-----

## 🔑 API Endpoints

The backend provides a single endpoint to retrieve the ranking data.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v_1/ranking` | Fetches all student records and their rankings. |

**Example Response:**

```json
{
  "message": "Student ranking data fetched successfully.",
  "data": [
    {
      "rank": 1,
      "name": "John Doe",
      "seatNumber": "UBIT12345",
      "marks": 95.5
    },
    {
      "rank": 2,
      "name": "Jane Smith",
      "seatNumber": "UBIT67890",
      "marks": 92.0
    }
  ]
}
```

-----

## 📂 File Structure

```
TheRankingApp_UBIT_SemesterII/
├── cli/                 # Java CLI application source code
│   ├── data/
│   │   └── student_data.txt
│   ├── File/
│   │   └── InputFile.java
│   ├── Student/
│   │   └── Student.java
│   │   └── StudentList.java
│   ├── Teacher/
│   │   └── Teacher.java
│   ├── CliController.java
│   └── Main.java
├── frontend/            # React frontend application
│   └── src/
│       ├── assets/
│       ├── components/
│       │   └── StudentDetails.tsx
│       ├── App.tsx
│       └── index.tsx
├── backend/             # Node.js backend
│   ├── controllers/
│   │   └── Ranking.controller.js
│   ├── routes/
│   │   └── Ranking.route.js
│   ├── .env
│   ├── app.js
│   └── index.js
└── README.md
```

-----
