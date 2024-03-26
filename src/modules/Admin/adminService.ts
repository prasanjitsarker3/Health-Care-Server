import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchingField } from "./adminConstant";
import paginationCalculation from "../../Helpers/paginationHelpers";
import prisma from "../../Shared/prisma";
import { IAdminFilterRequest } from "./adminInterface";
import { IPaginationOptions } from "../../Interface/interface";

const getAllAdminFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchingField.map((field) => ({
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

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
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
  const total = await prisma.admin.count({
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

const singleDataFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminDataIntoDB = async (id: string, params: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: params,
  });
  return result;
};

const deleteAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({ where: { id } });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDataDelete = await transactionClient.admin.delete({
      where: { id },
    });
    await transactionClient.user.delete({
      where: {
        email: adminDataDelete.email,
      },
    });
    return adminDataDelete;
  });
  return result;
};

const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({ where: { id, isDeleted: false } });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
    await transactionClient.user.update({
      where: { email: adminDeleteData.email },
      data: { status: UserStatus.DELETED },
    });
    return adminDeleteData;
  });
  return result;
};

export const adminService = {
  getAllAdminFromDB,
  singleDataFromDB,
  updateAdminDataIntoDB,
  deleteAdminByIdFromDB,
  softDeleteAdminFromDB,
};
