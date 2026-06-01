import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL || 'https://demo.nopcommerce.com',
  valid_email: process.env.VALID_EMAIL || 'testemail',
  valid_password: process.env.VALID_PASSWORD || 'testpassword',
};
