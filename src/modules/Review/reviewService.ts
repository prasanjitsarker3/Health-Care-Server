import httpStatus from "http-status";
import ApiError from "../../App/Error/ApiError";
import prisma from "../../Shared/prisma";
import { IUser } from "../User/userInterface";
import paginationCalculation from "../../Helpers/paginationHelpers";
import { IPaginationOptions } from "../../Interface/interface";

const createReview = async (user: IUser, payload: any) => {
  const appointmentInfo = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!(user.email === appointmentInfo.patient.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not your appointment!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const reviewData = await tx.review.create({
      data: {
        appointmentId: appointmentInfo.id,
        doctorId: appointmentInfo.doctorId,
        patientId: appointmentInfo.patientId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: reviewData.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return reviewData;
  });
  return result;
};

const getAllReviewFomDB = async (options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculation(options);

  const result = await prisma.review.findMany({
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
  const total = await prisma.review.count({});
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const reviewService = {
  createReview,
  getAllReviewFomDB,
};
