import express from "express";
import { doctorScheduleController } from "./doctorScheduleController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/mySchedule",
  auth(UserRole.DOCTOR),
  doctorScheduleController.getMySchedule
);
router.get(
  "",
  auth(
    UserRole.DOCTOR,
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATIENT
  ),
  doctorScheduleController.getAllScheduleFromDB
);

router.post(
  "/create",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  doctorScheduleController.doctorScheduleCreate
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  doctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;
