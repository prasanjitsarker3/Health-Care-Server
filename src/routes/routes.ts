import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/authRoutes";
import { specialtiesRoutes } from "../modules/Specialties/specialties.routes";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";

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
];

moduleRoute.forEach((route) => router.use(route.path, route.element));
export default router;
