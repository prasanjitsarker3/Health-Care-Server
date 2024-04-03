import { Request } from "express";
import { IFile } from "../../Interface/file";
import { fileUploader } from "../../Helpers/fileUploader";
import prisma from "../../Shared/prisma";

const specialtiesInsertToDB = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadFile?.secure_url;
  }
  const payload = req.body;
  const result = await prisma.specialties.create({
    data: payload,
  });
  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany({});
  return result;
};

const deleteSpecialtiesFromDB = async (id: string) => {
  const data = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.specialties.delete({
    where: {
      id: data.id,
    },
  });
  return result;
};
export const specialtiesService = {
  specialtiesInsertToDB,
  getAllSpecialties,
  deleteSpecialtiesFromDB,
};
