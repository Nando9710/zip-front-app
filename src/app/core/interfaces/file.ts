import { FormControl } from "@angular/forms";
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

export interface CreateFile {
  file: File;
  description: string;
}

export interface CreateFileForm {
  file: FormControl<string>;
  description: FormControl<string>;
}

export interface EditFile {
  description: string;
}

export interface FileDownloaded {
  data: Blob;
  error: unknown;
}
