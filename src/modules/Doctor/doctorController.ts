import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { doctorService } from "./doctorService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import {
  doctorFilterableFields,
  optionsPaginationFields,
} from "./doctorConstant";
import pick from "../../Shared/Pick";

const getAllDoctorFromDB = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, doctorFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);

  const result = await doctorService.getAllDoctorFromDB(
    filterData,
    optionsData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Fetched Successfully !",
    data: result,
  });
});

const getSingleDoctorFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.getSingleDoctorFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Retrieved  Successfully !",
      data: result,
    });
  }
);
const deletedDoctorFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.deletedDoctorFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Deleted  Successfully !",
    data: result,
  });
});

const updateDoctorIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await doctorService.updateDoctorIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Updated  Successfully !",
    data: result,
  });
});

export const doctorController = {
  getAllDoctorFromDB,
  getSingleDoctorFromDB,
  deletedDoctorFromDb,
  updateDoctorIntoDB,
};
