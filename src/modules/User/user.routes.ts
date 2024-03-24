import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", userController.createdAdmin);

export const userRoutes = router;
