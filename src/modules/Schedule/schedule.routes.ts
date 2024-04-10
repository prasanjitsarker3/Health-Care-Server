import express from "express";
import { scheduleController } from "./scheduleController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  scheduleController.scheduleCreate
);
router.get("", auth(UserRole.DOCTOR), scheduleController.getSchedule);
router.get("/:id", scheduleController.getSingleSchedule);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.DOCTOR),
  scheduleController.deleteSchedule
);

export const scheduleRoutes = router;
