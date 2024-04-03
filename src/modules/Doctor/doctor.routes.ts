import express from "express";
import { doctorController } from "./doctorController";
const router = express.Router();

router.get("", doctorController.getAllDoctorFromDB);
router.get("/:id", doctorController.getSingleDoctorFromDB);
router.delete("/:id", doctorController.deletedDoctorFromDb);
router.patch("/:id", doctorController.updateDoctorIntoDB);

export const doctorRoutes = router;
