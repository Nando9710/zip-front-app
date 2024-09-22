import { FormControl } from "@angular/forms";

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface LoginIn {
  email: string;
  password: string;
}

export interface LoginOut {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

