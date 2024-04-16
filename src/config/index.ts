import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  PORT: process.env.PORT,
  //   dataBaseUrl: process.env.dataBaseUrl,
  //   projectProcess: process.env.projectProcess,
  //   bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
  accessToken: process.env.accessToken,
  accessTokenExpireDate: process.env.accessTokenExpireDate,
  refreshToken: process.env.refreshToken,
  refreshTokenExpireDate: process.env.refreshTokenExpireDate,
  resetToken: process.env.resetToken,
  resetTokenExpireDate: process.env.resetTokenExpireDate,
  resetPasswordLink: process.env.resetPasswordLink,
  emailSender: {
    email: process.env.email,
    appPassword: process.env.appPassword,
  },
  ssl: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    fail_url: process.env.FAIL_URL,
    ssl_payment_api: process.env.SSL_PAYMENT_API,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
  },
};
