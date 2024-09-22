import { environment } from "@env";

export const BASE_URL: string = environment.apiUrl;

// USER
export const USERS_URL: string = BASE_URL + 'user';
