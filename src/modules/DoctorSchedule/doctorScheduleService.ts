import prisma from "../../Shared/prisma";
import { IUser } from "../User/userInterface";

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

export const doctorScheduleService = {
  insertDoctorScheduleIntoDB,
};
