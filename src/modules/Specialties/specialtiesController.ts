import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { specialtiesService } from "./specialtiesService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const specialtiesInsertToDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await specialtiesService.specialtiesInsertToDB(req);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Specialties Created Successfully !",
      data: result,
    });
  }
);

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getAllSpecialties();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Fetched Successfully !",
    data: result,
  });
});
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtiesService.deleteSpecialtiesFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Deleted Successfully !",
    data: result,
  });
});

export const specialtiesController = {
  specialtiesInsertToDB,
  getAllSpecialties,
  deleteSpecialties,
};
