import { NextFunction, Request, Response } from "express";
import { adminService } from "./adminService";
import pick from "../../Shared/Pick";
import {
  adminFilterableFields,
  optionsPaginationFields,
} from "./adminConstant";
import sendResponse from "../../Utilities/sendResponse";
import httpStatus from "http-status";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterData = pick(req.query, adminFilterableFields);
    const optionsData = pick(req.query, optionsPaginationFields);
    console.log(filterData);
    const result = await adminService.getAllAdminFromDB(
      filterData,
      optionsData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data Fetch Successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

const singleDataById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await adminService.singleDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Single Data Fetch Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updatedAdminDataById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await adminService.updateAdminDataIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Single Data Updated Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const deletedAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAdminByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Deleted Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const softDeletedAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await adminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Deleted Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const adminController = {
  getAllAdmin,
  singleDataById,
  updatedAdminDataById,
  deletedAdminById,
  softDeletedAdminById,
};
