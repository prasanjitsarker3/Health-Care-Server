import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { scheduleService } from "./scheduleService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Doctor/doctorConstant";
import { scheduleFilterableFields } from "./scheduleContants";
import { IUser } from "../User/userInterface";

const scheduleCreate = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.insertScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Create Successfully !",
    data: result,
  });
});

const getSchedule = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const filterData = pick(req.query, scheduleFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    const result = await scheduleService.getScheduleFromDB(
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

export const scheduleController = {
  scheduleCreate,
  getSchedule,
};
