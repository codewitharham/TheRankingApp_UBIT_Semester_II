
import express from "express"
import {getRanking} from "../controllers/Ranking.controller.js"

const router = express.Router() // create a router object to define routes



router.get("/ranking", getRanking) // route to get the ranking of items

export {router as RankingRouter}


