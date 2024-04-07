import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { scheduleService } from "./scheduleService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const scheduleCreate = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.insertScheduleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule Create Successfully !",
    data: result,
  });
});

export const scheduleController = {
  scheduleCreate,
};
