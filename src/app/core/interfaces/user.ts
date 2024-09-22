import { FormControl } from "@angular/forms";
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

export interface CreateUser {
  name: string;
  lastName: string
  email: string;
  password: string;
}

export interface EditUser extends Partial<CreateUser> {}

export interface CreateUserForm {
  name: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}
