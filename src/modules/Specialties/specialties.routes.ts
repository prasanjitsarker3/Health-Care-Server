import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialtiesController";
import { fileUploader } from "../../Helpers/fileUploader";
import { specialtiesValidationSchema } from "./specialtiesValidation";

const router = express.Router();
router.get("", specialtiesController.getAllSpecialties);
router.post(
  "/create",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidationSchema.parse(JSON.parse(req.body.data));
    return specialtiesController.specialtiesInsertToDB(req, res, next);
  }
);

router.delete("/:id", specialtiesController.deleteSpecialties);

export const specialtiesRoutes = router;
