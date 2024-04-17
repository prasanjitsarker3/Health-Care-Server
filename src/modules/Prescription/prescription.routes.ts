import express from "express";
import { prescriptionController } from "./prescriptionController";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get(
  "/my-prescription",
  auth(UserRole.PATIENT),
  prescriptionController.myPrescription
);
router.post(
  "/create",
  auth(UserRole.DOCTOR),
  prescriptionController.createPrescription
);

export const prescriptionRoutes = router;
