import { UserStatus } from "@prisma/client";
import prisma from "../../Shared/prisma";
import { createToken } from "../../Utilities/createToken";
import { verifyToken } from "../../Utilities/verifyToken";
import config from "../../config";
import { ILogin } from "./authInterface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const loginUser = async (payload: ILogin) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Incorrect password");
  }

  const jwtPayload: JwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.accessToken as string,
    config.accessTokenExpireDate as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refreshToken as string,
    config.refreshTokenExpireDate as string
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.refreshToken as string);
  } catch (err) {
    throw new Error("Your are not authorized !");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("User Data Not Found !");
  }

  const jwtPayload: JwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.accessToken as string,
    config.accessTokenExpireDate as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};
