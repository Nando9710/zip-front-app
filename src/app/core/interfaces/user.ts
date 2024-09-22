import { Files } from "./file";

export interface User {
  id: string;
  name: string;
  lastName?: string
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  files?: Files[];
}
