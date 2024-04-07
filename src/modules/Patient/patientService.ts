import { Patient, Prisma } from "@prisma/client";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { IPaginationOptions } from "../../Interface/interface";
import prisma from "../../Shared/prisma";
import { IPatientFilterRequest, IPatientUpdate } from "./patientInterface";
import { patientSearchingField } from "./patientConstant";

const getAllPatientFromDB = async (
  params: IPatientFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.PatientWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: patientSearchingField.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
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

  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };
  const result = await prisma.patient.findMany({
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

    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  const total = await prisma.patient.count({
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

const getSinglePatient = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return result;
};

const updatePatientIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  const patientInfo = await prisma.patient.findUniqueOrThrow({ where: { id } });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patient.update({
      where: {
        id: patientInfo.id,
        isDeleted: false,
      },
      data: patientData,
    });

    //Create or Update Patient Health Data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    //Create  Patient Medical Data
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const responseData = await prisma.patient.findUniqueOrThrow({
    where: { id },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return responseData;
};

const deletePatientFromDB = async (id: string) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    //Delete Medical Report
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    //Delete Patient Health Data
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletePatient = await tx.patient.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: patientInfo.email,
      },
    });
    return deletePatient;
  });

  return result;
};

export const patientService = {
  getAllPatientFromDB,
  getSinglePatient,
  updatePatientIntoDB,
  deletePatientFromDB,
};
