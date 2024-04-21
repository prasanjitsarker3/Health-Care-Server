import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { IUser } from "../User/userInterface";
import { metaService } from "./metaService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const getMetaData = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await metaService.healCareMetaData(user as IUser);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta Data Fetch  Successfully !",
      data: result,
    });
  }
);

export const metaController = {
  getMetaData,
};
