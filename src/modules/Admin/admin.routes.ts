import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./adminController";
import validationRequest from "../../Middleware/validationRequest";
import { adminValidationSchema } from "./adminValidationSchema";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/all",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  adminController.getAllAdmin
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  adminController.singleDataById
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  validationRequest(adminValidationSchema.updateAdminSchema),
  adminController.updatedAdminDataById
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  adminController.deletedAdminById
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  adminController.softDeletedAdminById
);

export const adminRoutes = router;
