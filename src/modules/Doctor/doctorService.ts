import { Doctor, Prisma, UserStatus } from "@prisma/client";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { IPaginationOptions } from "../../Interface/interface";
import prisma from "../../Shared/prisma";
import { doctorSearchingField } from "./doctorConstant";

const getAllDoctorFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, specialties, ...filterData } = params;
  console.log(specialties);
  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: doctorSearchingField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  //  Doctor -> doctorSpecialties -> specialties -> title

  if (specialties && specialties.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
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
  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };
  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            averageRating: "desc",
          },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({
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

const getSingleDoctorFromDB = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const deletedDoctorFromDb = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (transactionClient) => {
    const userData = await transactionClient.doctor.update({
      where: {
        id: id,
      },
      data: { isDeleted: true },
    });
    await transactionClient.user.update({
      where: {
        email: userData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return userData;
  });
  return result;
};

//Update Doctor

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  await prisma.$transaction(async (transactionClient) => {
    const updateDoctor = await transactionClient.doctor.update({
      where: { id },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesId = specialties.filter(
        (specialty: { specialtiesId: any; isDelete: any }) => specialty.isDelete
      );

      for (const specialty of deleteSpecialtiesId) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }

      const createSpecialtiesId = specialties.filter(
        (specialty: { isDelete: any }) => !specialty.isDelete
      );

      for (const specialty of createSpecialtiesId) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: updateDoctor.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return result;
};

export const doctorService = {
  getAllDoctorFromDB,
  getSingleDoctorFromDB,
  deletedDoctorFromDb,
  updateDoctorIntoDB,
};
