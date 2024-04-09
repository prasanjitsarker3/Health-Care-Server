import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import sendResponse from "../../Utilities/sendResponse";
import { doctorScheduleService } from "./doctorScheduleService";
import httpStatus from "http-status";
import { IUser } from "../User/userInterface";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Doctor/doctorConstant";
import { doctorScheduleFilterableFields } from "./doctorScheduleConstants";

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

const getMySchedule = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const filterData = pick(req.query, doctorScheduleFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await doctorScheduleService.getMySchedule(
      filterData,
      optionsData,
      user as IUser
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule Fetch Successfully !",
      data: result,
    });
  }
);
const getAllScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, doctorScheduleFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);
  const result = await doctorScheduleService.getAllScheduleFromDB(
    filterData,
    optionsData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule Fetch Successfully !",
    data: result,
  });
});
const deleteFromDB = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await doctorScheduleService.deleteFromDB(user as IUser, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule Delete Successfully !",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  doctorScheduleCreate,
  getMySchedule,
  deleteFromDB,
  getAllScheduleFromDB,
};
