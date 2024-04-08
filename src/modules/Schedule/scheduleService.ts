import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../Shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { ISchedule } from "./scheduleIterface";
import { IPaginationOptions } from "../../Interface/interface";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { IUser } from "../User/userInterface";

const insertScheduleIntoDB = async (
  payload: ISchedule
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const currentDate = new Date(startDate); // Start Date
  const lastDate = new Date(endDate); // End Date

  const schedules = [];
  const intervalTime = 30;

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleDate = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, intervalTime),
      };
      const existSchedule = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleDate.startDate,
          endDate: scheduleDate.endDate,
        },
      });
      if (!existSchedule) {
        const result = await prisma.schedule.create({ data: scheduleDate });
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getScheduleFromDB = async (
  params: any,
  options: IPaginationOptions,
  user: IUser
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { startDate, endDate, ...filterData } = params;
  console.log(startDate, endDate);
  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDate: {
            gte: startDate,
          },
        },
        {
          endDate: {
            lte: endDate,
          },
        },
      ],
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

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      dcotor: {
        email: user.email,
      },
    },
  });
  console.log(doctorSchedules);

  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };
  const result = await prisma.schedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "asc",
          },
  });
  const total = await prisma.schedule.count({
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

export const scheduleService = {
  insertScheduleIntoDB,
  getScheduleFromDB,
};
