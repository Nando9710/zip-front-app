import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditFile, FileDownloaded, Files } from '@interfaces/file';
import { FILES_URL, FILES_URL_ID, UPLOAD_FILE_URL } from '@constants/endpoints';
import { SUPABASE_CONFIG } from '../../../../../supabase.config';
import { from, of } from 'rxjs';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        FileService
      ]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all files', () => {
    const dummyFiles: Files[] = [
      { id: '1', name: 'file1.zip', description: 'description', path: 'file1.zip' },
      { id: '2', name: 'file2.zip', description: 'description', path: 'file2.zip' }
    ];

    service.getFiles().subscribe({
      next: files => {
        expect(files.length).toBe(2);
        expect(files).toEqual(dummyFiles);
      }
    });

    const req = httpMock.expectOne(FILES_URL);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFiles);
  });

  it('should upload a file', () => {
    const dummyFile: Files =
      { id: '1', name: 'file1.zip', description: 'description1', path: 'file1.zip' }

    const formData = new FormData();
    formData.append('file', new File([''], 'file1.zip'));
    formData.append('description', 'description1');
    formData.append('userId', '1');

    service.uploadFile(formData).subscribe({
      next: (file) => {
        expect(file).toEqual(dummyFile);
      }
    });

    const req = httpMock.expectOne(UPLOAD_FILE_URL);
    expect(req.request.method).toBe('POST');
    req.flush(dummyFile);
  });

  it('should download a file', (done) => {
    const filePath = 'file1.zip';
    const dummyDownloadedFile: FileDownloaded = { data: new Blob(), error: null };

    const spyDownload = jest.spyOn(service, 'downloadFile')

    spyDownload.mockReturnValueOnce(of(dummyDownloadedFile));

    service.downloadFile(filePath).subscribe({
      next: file => {
        expect(file).toEqual(dummyDownloadedFile);
        expect(spyDownload).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should edit a file', () => {
    const dummyFile: Files = { id: '1', name: 'file1.zip', description: 'description2', path: 'file1.zip' };
    const editData: EditFile = { description: 'description2' };
    const id = '1';
    const url = FILES_URL_ID.replace(':id', id);

    service.editFile(editData, id).subscribe({
      next: file => {
        expect(file).toEqual(dummyFile);
      }
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PATCH');
    req.flush(dummyFile);
  });

  it('should delete a file', () => {
    const id = '1';
    const dummyFiles: Files[] = [{ id: '2', name: 'file2.zip', description: '', path: 'file2.zip' }];
    const url = FILES_URL_ID.replace(':id', id);

    service.deleteFile(id).subscribe({
      next: files => {
        expect(files).toEqual(dummyFiles);
      }
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyFiles);
  });
})
