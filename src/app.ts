import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"
import authRouter from "./routes/auth"

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())
app.use('/auth', authRouter)

export default app;