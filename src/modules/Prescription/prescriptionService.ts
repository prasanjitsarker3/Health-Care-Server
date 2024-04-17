import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import prisma from "../../Shared/prisma";
import { IUser } from "../User/userInterface";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../Interface/interface";
import paginationCalculation from "../../Helpers/paginationHelpers";

const generatedPrescription = async (
  user: IUser,
  payload: Partial<Prescription>
) => {
  console.log({ user, payload });
  const appointmentInfo = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!(user.email === appointmentInfo.doctor.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This is not your appointment !"
    );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentInfo.id,
      doctorId: appointmentInfo.doctorId,
      patientId: appointmentInfo.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
  });
  return result;
};

const getMyPrescription = async (user: IUser, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const prescriptionService = {
  generatedPrescription,
  getMyPrescription,
};
