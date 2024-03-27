import { UserStatus } from "@prisma/client";
import prisma from "../../Shared/prisma";
import { createToken } from "../../Utilities/createToken";
import { verifyToken } from "../../Utilities/verifyToken";
import config from "../../config";
import { IChangePassword, ILogin, ITokenUser } from "./authInterface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../../App/Error/ApiError";
import httpStatus from "http-status";
import emailSender from "./emailSender";

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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your are not authorized !");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Data Not Found !");
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

const changePassword = async (user: ITokenUser, payload: IChangePassword) => {
  console.log({ user, payload });
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Data Not Found !");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.NOT_FOUND, "Password doesn't match !");
  }

  const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password Change Successfully ",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetToken = createToken(
    { email: userData.email, role: userData.role },
    config.resetToken as string,
    config.resetTokenExpireDate as string
  );

  const resetPasswordLink =
    config.resetPasswordLink + `?userId=${userData.id}&token=${resetToken}`;
  await emailSender(
    userData.email,
    `
    <div>
         <h1>Hello Dear ,</h1>
         <p>Your Password reset link 
            <a href=${resetPasswordLink}><button>Reset Password</button></a>
         </p>
    </div>
    `
  );
  console.log(resetPasswordLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = verifyToken(token, config.resetToken as string);
  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  const hashPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
    },
  });

  return {
    message: "Password Reset Successfully ",
  };
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
