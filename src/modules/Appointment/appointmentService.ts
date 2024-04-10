import httpStatus from "http-status";
import ApiError from "../../App/Error/ApiError";
import prisma from "../../Shared/prisma";
import { IUser } from "../User/userInterface";
import { v4 as uuidv4 } from "uuid";
import { IAuthUser } from "../../App/Common/IAuthUser";
import { IPaginationOptions } from "../../Interface/interface";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { Prisma, UserRole } from "@prisma/client";

const createAppointmentIntoDB = async (user: IUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const scheduleData = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  if (!scheduleData) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED, "Schedule Data Not Found!");
  }
  const videoCallingId = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: scheduleData?.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: scheduleData.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    const today = new Date();
    const transactionId =
      "HealCare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFree,
        transactionId,
      },
    });
    return appointmentData;
  });

  return result;
};

const getMyAppointment = async (
  user: IAuthUser,
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { ...filterData } = params;
  const andCondition: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.DOCTOR) {
    andCondition.push({
      doctor: {
        email: user?.email,
      },
    });
  } else if (user.role === UserRole.PATIENT) {
    andCondition.push({
      patient: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  const result = await prisma.appointment.findMany({
    where: whereCondition,
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
    include:
      user.role === UserRole.DOCTOR
        ? {
            patient: {
              include: {
                medicalReport: true,
                patientHealthData: true,
              },
            },
            schedule: true,
          }
        : {
            doctor: true,
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereCondition,
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

export const appointmentService = {
  createAppointmentIntoDB,
  getMyAppointment,
};
