import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FILES_URL, FILES_URL_ID, UPLOAD_FILE_URL } from '@constants/endpoints';
import { EditFile, FileDownloaded, Files } from '@interfaces/file';
import { from, Observable } from 'rxjs';
import { SUPABASE_CONFIG } from '../../../../../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  /**
   * Injections
   */
  private readonly http: HttpClient = inject(HttpClient);

  public getFiles(): Observable<Files[]> {
    return this.http.get<Files[]>(FILES_URL);
  }

  public uploadFile(data: FormData): Observable<Files> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<Files>(UPLOAD_FILE_URL, data, { headers });
  }

  public downloadFile(filePath: string): Observable<FileDownloaded> {
    return from(SUPABASE_CONFIG.storage.from("zip-app").download(filePath));
  }

  public editFile(data: EditFile, id: string): Observable<Files> {
    const URL = FILES_URL_ID.replace(':id', id);

    return this.http.patch<Files>(URL, data);
  }

  public deleteFile(id: string): Observable<Files[]> {
    const URL = FILES_URL_ID.replace(':id', id);
    return this.http.delete<Files[]>(URL);
  }
}
