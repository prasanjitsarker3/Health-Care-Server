import { Prisma } from "@prisma/client";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { IPaginationOptions } from "../../Interface/interface";
import prisma from "../../Shared/prisma";
import { IUser } from "../User/userInterface";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";

const insertDoctorScheduleIntoDB = async (
  payload: { scheduleIds: string[] },
  user: IUser
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMySchedule = async (
  params: any,
  options: IPaginationOptions,
  user: IUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { startDate, endDate, ...filterData } = params;
  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput = {
    AND: andCondition,
  };
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.doctorSchedules.findMany({
    where: { ...whereCondition, doctorId: doctorData.id },
    skip,
    take: limit,
    // orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: { ...whereCondition, doctorId: doctorData.id },
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
const getAllScheduleFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { startDate, endDate, ...filterData } = params;
  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip,
    take: limit,
    // orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : {},
  });
  const total = await prisma.doctorSchedules.count({
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

const deleteFromDB = async (user: IUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const scheduleIsBooked = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });
  if (scheduleIsBooked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Schedule already booked, You can not deleted !"
    );
  }
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const doctorScheduleService = {
  insertDoctorScheduleIntoDB,
  getMySchedule,
  deleteFromDB,
  getAllScheduleFromDB,
};
