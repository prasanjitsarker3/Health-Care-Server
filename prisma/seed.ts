import { UserRole } from "@prisma/client";
import prisma from "../src/Shared/prisma";
import * as bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPPER_ADMIN,
      },
    });
    if (isExistSuperAdmin) {
      console.log("Super Admin already exists!");
    }
    const hashPassword: string = await bcrypt.hash("superAdmin123", 12);
    const createSuperAdmin = await prisma.user.create({
      data: {
        email: "superAdmin1234@gmail.com",
        password: hashPassword,
        role: UserRole.SUPPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin Final",
            contactNumber: "9804394",
          },
        },
      },
    });
    console.log("Create Successfully Super Admin !", createSuperAdmin);
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};
seedSuperAdmin();
