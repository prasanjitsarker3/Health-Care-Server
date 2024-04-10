import express from "express";
import { appointmentController } from "./appointmentController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/my-appointment",
  auth(UserRole.DOCTOR, UserRole.PATIENT),
  appointmentController.getMyAppointment
);

// get all appointment route pending

router.post(
  "/create",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT),
  appointmentController.createAppointment
);

export const appointmentRoutes = router;
