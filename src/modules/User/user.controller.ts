import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Admin/adminConstant";
import { userFilterableFields } from "./userConstant";

const createdAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createdAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created Successfully",
    data: result,
  });
});
const createdDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createdDoctor(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Created Successfully",
    data: result,
  });
});

const createdPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createdPatient(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Created Successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, userFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);

  const result = await userService.getAllUserFromDB(filterData, optionsData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Data Fetch Successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  createdAdmin,
  createdDoctor,
  createdPatient,
  getAllUser,
};
