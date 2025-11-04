import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"
import authRouter from "./routes/auth"
import uploadRouter from "./routes/upload"
import postRouter from "./routes/post"
import userRouter from "./routes/user"
import eventRouter from "./routes/event"
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

app.use("/uploads", express.static("uploads"));

app.use('/auth', authRouter)
app.use("/upload", uploadRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/event", eventRouter);

app.use(errorHandler);

export default app;