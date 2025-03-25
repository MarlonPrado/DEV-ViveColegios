import * as dotenv from 'dotenv';

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case 'test':
    path = `${__dirname}/../../.env`;
    break;
  case 'production':
    path = `${__dirname}/../../.env`;
    break;
  default:
    path = `${__dirname}/../../.env`;
}

dotenv.config({ path: path });

export const dev = process.env.NODE_ENV !== 'production';
export const port = process.env.PORT || 4000;
export const cors = process.env.CORS;
export const dbUser = process.env.DB_USER || 'db_user_vivecolegios';
export const dbPassword = process.env.DB_PASSWORD || 'db_user_vivecolegios2021';
export const dbHost = process.env.DB_HOST || 'cluster0.lsyav.mongodb.net';
export const dbName = process.env.DB_NAME || 'app_db_vivecolegios';
export const dbPort = 27017;
export const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
export const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD;
export const authJwtSecret = process.env.AUTH_JWT_SECRET;
export const publicApiKeyToke = process.env.PUBLIC_API_KEY_TOKEN;
export const adminApiKeyToken = process.env.ADMIN_API_KEY_TOKEN;

export const SERVER_PORT_APP = 4001;
export const GATEWAY_HTTP_PORT_APP = 4000;
export const GATEWAY_HTTPS_PORT_APP = 4100;
export const SERVER_NAME_APP = 'Vive Colegios 3.0';
