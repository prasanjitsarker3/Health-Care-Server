import express from "express";
import { scheduleController } from "./scheduleController";

const router = express.Router();

router.post("/create", scheduleController.scheduleCreate);

export const scheduleRoutes = router;
