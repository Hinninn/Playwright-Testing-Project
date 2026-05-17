import * as dotenv from 'dotenv';
//import dotenv
// Nạp biến môi trường từ file .env (BASE_URL, NOP_PASSWORD, …) vào process.env
dotenv.config();
//export config, biến là baseURL,valid_
//đọc process.env, dô env đọc biến BaseURL
//muốn suwe dunhj dc phải import config vào, nghĩa à config.
export const config = {
  baseURL: process.env.BASE_URL || 'https://demo.nopcommerce.com',
  valid_email: process.env.VALID_EMAIL || 'testemail',
  valid_password: process.env.VALID_PASSWORD || 'testpassword',
};
