import httpStatus from "http-status";
import ApiError from "../../App/Error/ApiError";
import config from "../../config";
import axios from "axios";
import { date } from "zod";
import { IPaymentData } from "./sslInterface";

const initPayment = async (initPaymentData: IPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: initPaymentData.amount,
      currency: "BDT",
      tran_id: initPaymentData.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.success_url,
      fail_url: config.ssl.fail_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: initPaymentData.name,
      cus_email: initPaymentData.email,
      cus_add1: initPaymentData.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: initPaymentData.phone,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: config.ssl.ssl_payment_api,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment error occured");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_pass}&formate=json`,
    });
    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment Validation Fail !");
  }
};

export const sslService = {
  initPayment,
  validatePayment,
};
