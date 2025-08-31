// Index.js is the entry point of the application
import dotenv from "dotenv"
dotenv.config() // to read the .env file and set the environment variables  
import {app} from "./app.js"

const PORT = process.env.PORT || 5000 // default port is 5000 if not specified in .env file
const HOST = process.env.HOST || `http://localhost:${PORT}` // default host is localhost if not specified in .env file

app.listen(PORT, () => console.log(`Server started on port ${PORT}, http://localhost:${PORT}`)) // start the server and listen on the specified port