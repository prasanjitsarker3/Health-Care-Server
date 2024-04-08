import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import sendResponse from "../../Utilities/sendResponse";
import { doctorScheduleService } from "./doctorScheduleService";
import httpStatus from "http-status";
import { IUser } from "../User/userInterface";

const doctorScheduleCreate = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleService.insertDoctorScheduleIntoDB(
      req.body,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Doctor Schedule Create Successfully !",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  doctorScheduleCreate,
};
