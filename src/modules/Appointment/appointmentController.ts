import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { appointmentService } from "./appointmentService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import { IUser } from "../User/userInterface";
import { optionsPaginationFields } from "../Doctor/doctorConstant";
import pick from "../../Shared/Pick";

const createAppointment = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await appointmentService.createAppointmentIntoDB(
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
const getMyAppointment = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const filterData = pick(req.query, ["status", "paymentStatus"]);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await appointmentService.getMyAppointment(
      user as IUser,
      filterData,
      optionsData
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "My Appointment Retrieved  Successfully !",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
  getMyAppointment,
};
