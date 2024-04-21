import express from "express";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { metaController } from "./metaController";

const router = express.Router();
router.get(
  "",
  auth(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  metaController.getMetaData
);
export const metaRoutes = router;
