import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";

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
];

moduleRoute.forEach((route) => router.use(route.path, route.element));
export default router;
