import express from "express";
import { patientController } from "./patientController";

const router = express.Router();

router.get("", patientController.getAllPatientFromDB);
router.get("/:id", patientController.getSinglePatient);
router.patch("/:id", patientController.updatePatientIntoDB);
router.delete("/:id", patientController.deletePatientFromDB);

export const patientRoutes = router;
