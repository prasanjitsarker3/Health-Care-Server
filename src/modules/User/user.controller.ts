import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Admin/adminConstant";
import { userFilterableFields } from "./userConstant";
import { IUser } from "./userInterface";

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
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Change Profile Status Successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await userService.getMyProfile(user as IUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile data fetched !",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await userService.updateMyProfile(user as IUser, req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile Data Updated Successfully !",
      data: result,
    });
  }
);

export const userController = {
  createdAdmin,
  createdDoctor,
  createdPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
