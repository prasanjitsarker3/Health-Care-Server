import { NextFunction, Request, Response } from "express";
import { adminService } from "./adminService";
import pick from "../../Shared/Pick";
import {
  adminFilterableFields,
  optionsPaginationFields,
} from "./adminConstant";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filterData = pick(req.query, adminFilterableFields);
  const optionsData = pick(req.query, optionsPaginationFields);

  const result = await adminService.getAllAdminFromDB(filterData, optionsData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Data Fetch Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const singleDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.singleDataFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Single Data Fetch Successfully",
    data: result,
  });
});

const updatedAdminDataById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.updateAdminDataIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Single Data Updated Successfully",
    data: result,
  });
});
const deletedAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.deleteAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Deleted Successfully",
    data: result,
  });
});

const softDeletedAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.softDeleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Deleted Successfully",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  singleDataById,
  updatedAdminDataById,
  deletedAdminById,
  softDeletedAdminById,
};
