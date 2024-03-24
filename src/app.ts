import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";
import globalErrorHandler from "./Middleware/globalErrorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Hello",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;