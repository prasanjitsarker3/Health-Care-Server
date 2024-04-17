import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { IUser } from "../User/userInterface";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import { prescriptionService } from "./prescriptionService";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Doctor/doctorConstant";

const createPrescription = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await prescriptionService.generatedPrescription(
      user as IUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Appointment Create Successfully !",
      data: result,
    });
  }
);

const myPrescription = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await prescriptionService.getMyPrescription(
      user as IUser,
      optionsData
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Prescription Fetch  Successfully !",
      data: result,
    });
  }
);

export const prescriptionController = {
  createPrescription,
  myPrescription,
};
