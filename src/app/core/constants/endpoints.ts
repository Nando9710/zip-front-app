import { environment } from "@env";

export const BASE_URL: string = environment.apiUrl;

// USER
export const USERS_URL: string = BASE_URL + 'user';
export const USERS_URL_ID: string = BASE_URL + 'user/:id';

// FILE
export const FILES_URL: string = BASE_URL + 'file';
export const FILES_URL_ID: string = BASE_URL + 'file/:id';
export const UPLOAD_FILE_URL: string = BASE_URL + 'file/upload';

// AUTH
export const LOGIN_URL: string = BASE_URL + 'auth/login';
