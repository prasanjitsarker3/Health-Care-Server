import {
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../Helpers/fileUploader";
import { IFile } from "../../Interface/file";
import { Request } from "express";
import { IPaginationOptions } from "../../Interface/interface";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { userSearchingField } from "./userConstant";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const createdAdmin = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);

    req.body.admin.profilePhoto = uploadFile?.secure_url;
  }

  const hashPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createAdminData;
  });
  return result;
};

const createdDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);

    req.body.doctor.profilePhoto = uploadFile?.secure_url;
  }

  const hashPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    const createDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    console.log(createDoctorData);
    return createDoctorData;
  });
  return result;
};

const createdPatient = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadFile?.secure_url;
  }

  const hashPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });
    return createPatientData;
  });
  return result;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchingField.map((field) => ({
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

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.user.findMany({
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
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updateAt: true,
    },
  });
  const total = await prisma.user.count({
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

const changeProfileStatus = async (id: string, status: UserStatus) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !");
  }
  const updatedStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updateAt: true,
    },
  });
  return updatedStatus;
};

export const userService = {
  createdAdmin,
  createdDoctor,
  createdPatient,
  getAllUserFromDB,
  changeProfileStatus,
};
