import httpStatus from "http-status";
import catchAsync from "../../Utilities/catchAsync";
import sendResponse from "../../Utilities/sendResponse";
import { Request, Response } from "express";
import { paymentService } from "./paymentService";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const result = await paymentService.initPayment(appointmentId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment Initiate Successfully !",
    data: result,
  });
});
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.validatePayment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Validate Payment Successfully !",
    data: result,
  });
});

export const paymentController = {
  initPayment,
  validatePayment,
};
