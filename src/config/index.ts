import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.port,
  //   dataBaseUrl: process.env.dataBaseUrl,
  //   projectProcess: process.env.projectProcess,
  //   bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
  accessToken: process.env.accessToken,
  accessTokenExpireDate: process.env.accessTokenExpireDate,
  refreshToken: process.env.refreshToken,
  refreshTokenExpireDate: process.env.refreshTokenExpireDate,
};
