import express from "express";
import { adminController } from "./adminController";
import validationRequest from "../../Middleware/validationRequest";
import { adminValidationSchema } from "./adminValidationSchema";

const router = express.Router();

router.get("/all", adminController.getAllAdmin);
router.get("/:id", adminController.singleDataById);
router.patch(
  "/:id",
  validationRequest(adminValidationSchema.updateAdminSchema),
  adminController.updatedAdminDataById
);
router.delete("/:id", adminController.deletedAdminById);
router.delete("/soft/:id", adminController.softDeletedAdminById);

export const adminRoutes = router;
