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

export const scheduleRoutes = router;
