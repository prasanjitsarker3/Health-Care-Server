import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { verifyToken } from "../../Utilities/verifyToken";
import config from "../../config";
import { UserRole } from "@prisma/client";
import auth from "../../Middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  userController.createdAdmin
);

export const userRoutes = router;
