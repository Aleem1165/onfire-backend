import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"
import authRouter from "./routes/auth"
import uploadRouter from "./routes/upload"
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

app.use("/uploads", express.static("uploads"));

app.use('/auth', authRouter)
app.use("/upload", uploadRouter);

app.use(errorHandler);

export default app;