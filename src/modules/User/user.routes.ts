import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../Middleware/auth";
import { fileUploader } from "../../Helpers/fileUploader";
import { userValidation } from "./userValidation";

const router = express.Router();

router.get("/all-user", userController.getAllUser);

router.get(
  "/me",
  auth(
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  userController.getMyProfile
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createdAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createdDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  // auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userController.createdPatient(req, res, next);
  }
);
router.patch(
  "/:id/status",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  userController.changeProfileStatus
);

router.patch(
  "/profile_update",
  auth(
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.profileUpdate.parse(JSON.parse(req.body.data));
    return userController.updateMyProfile(req, res, next);
  }
);

export const userRoutes = router;
