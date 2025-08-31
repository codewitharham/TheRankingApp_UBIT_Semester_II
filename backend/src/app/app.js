import express, { Router } from "express"
import Cors from 'cors'



const app = express()

/* CONFIGURATION */ 
app.use(Cors({origin: process.env.CORS_ORIGIN})) // middleware so that only requests from the specified origin are accepted
app.use(express.json()) // middleware so that server can only accept data in JSON format
app.use(express.urlencoded({extended: true})) // middleware so that data from url can be read in server correctly
app.use(express.static("public"))



/* ROUTES */ 
import {RankingRouter} from "./routes/Ranking.route.js"

app.use("/api/v_1", RankingRouter) // all routes related to ranking will be prefixed with /api/ranking


export {app}