import express from "express";
import { doctorScheduleController } from "./doctorScheduleController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  doctorScheduleController.doctorScheduleCreate
);

export const doctorScheduleRoutes = router;
