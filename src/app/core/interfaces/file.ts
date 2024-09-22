import { User } from "./user";

export interface Files {
  id: string;
  name: string;
  description: string;
  path: string;
  created_at?: Date;
  updated_at?: Date;
  user?: User;
}
