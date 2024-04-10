import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/authRoutes";
import { specialtiesRoutes } from "../modules/Specialties/specialties.routes";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.routes";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.routes";
import { appointmentRoutes } from "../modules/Appointment/appointment.routes";

const router = express.Router();

const moduleRoute = [
  {
    path: "/users",
    element: userRoutes,
  },
  {
    path: "/admin",
    element: adminRoutes,
  },
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/specialties",
    element: specialtiesRoutes,
  },
  {
    path: "/doctor",
    element: doctorRoutes,
  },
  {
    path: "/patient",
    element: patientRoutes,
  },
  {
    path: "/schedule",
    element: scheduleRoutes,
  },
  {
    path: "/doctor_schedule",
    element: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    element: appointmentRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.element));
export default router;
