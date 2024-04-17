import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { IUser } from "../User/userInterface";
import sendResponse from "../../Utilities/sendResponse";
import { reviewService } from "./reviewService";
import httpStatus from "http-status";
import pick from "../../Shared/Pick";
import { optionsPaginationFields } from "../Admin/adminConstant";

const createReview = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await reviewService.createReview(user as IUser, req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review Create Successfully !",
      data: result,
    });
  }
);

const allReview = catchAsync(async (req: Request, res: Response) => {
  const optionsData = pick(req.query, optionsPaginationFields);
  const result = await reviewService.getAllReviewFomDB(optionsData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review Fetch  Successfully !",
    data: result,
  });
});

export const reviewController = {
  createReview,
  allReview,
};
