import express from "express";
import auth from "../../Middleware/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from "./reviewController";
const router = express.Router();

router.get(
  "",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  reviewController.allReview
);
router.post("/create", auth(UserRole.PATIENT), reviewController.createReview);

export const reviewRoutes = router;
