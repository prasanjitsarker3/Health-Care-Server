import { Request, Response } from "express";
import catchAsync from "../../Utilities/catchAsync";
import { patientService } from "./patientService";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import pick from "../../Shared/Pick";
import { patientFilterableFields } from "./patientConstant";
import { optionsPaginationFields } from "../Doctor/doctorConstant";

const getAllPatientFromDB = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, patientFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);
  const result = await patientService.getAllPatientFromDB(
    filterData,
    optionsData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Fetched Successfully !",
    data: result,
  });
});
const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.getSinglePatient(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Retrieved Successfully !",
    data: result,
  });
});

const updatePatientIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.updatePatientIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Data Update Successfully !",
    data: result,
  });
});
const deletePatientFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.deletePatientFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Delete Successfully !",
    data: result,
  });
});

export const patientController = {
  getAllPatientFromDB,
  getSinglePatient,
  updatePatientIntoDB,
  deletePatientFromDB,
};
