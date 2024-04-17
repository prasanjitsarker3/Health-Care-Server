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
router.get(
  "",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  appointmentController.getAllAppointment
);

router.post(
  "/create",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT),
  appointmentController.createAppointment
);

router.patch(
  "/status/:appointmentId",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  appointmentController.changeAppointment
);

export const appointmentRoutes = router;
