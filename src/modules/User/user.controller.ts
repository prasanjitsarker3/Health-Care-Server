import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";

const createdAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createdAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created Successfully",
    data: result,
  });
});

export const userController = {
  createdAdmin,
};
