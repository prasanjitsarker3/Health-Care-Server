import { PaymentStatus, UserRole } from "@prisma/client";
import { IUser } from "../User/userInterface";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";
import prisma from "../../Shared/prisma";

const healCareMetaData = async (user: IUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPPER_ADMIN:
      metaData = superAdminData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData(user);
      break;
    case UserRole.DOCTOR:
      metaData = doctorData(user);
      break;
    case UserRole.PATIENT:
      metaData = patientData(user);
      break;

    default:
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your are not authorized !");
  }
  return metaData;
};

const superAdminData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.patient.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    adminCount,
    paymentCount,
    totalRevenue,
  };
};

const getAdminMetaData = async (user: IUser) => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

const doctorData = async (user: IUser) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorAppointment = await prisma.appointment.count({
    where: {
      doctorId: doctorInfo.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorInfo.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorInfo.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorInfo.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    doctorAppointment,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum,
    formattedAppointmentStatusDistribution,
  };
};

const patientData = async (user: IUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const patientAppointment = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));

  return {
    formattedAppointmentStatusDistribution,
    patientAppointment,
    prescriptionCount,
    reviewCount,
  };
};

export const metaService = {
  healCareMetaData,
};
