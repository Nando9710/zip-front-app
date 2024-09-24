import { ChangeDetectionStrategy, Component, DestroyRef, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@interfaces/user';
import { UserService } from '@services/user.service';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { LoadingService } from '@services/loading/loading.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BASIC_MATDIALOG_CONFIG } from '@constants/basic-mat-dialog-config';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { FileService } from '@services/file/file.service';
import { FileDownloaded, Files } from '@interfaces/file';
import { AddEditFileComponent } from './components/add-edit-file/add-edit-file.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CapitalizePipe,
    UpperCasePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesComponent {
  /**
   * Injections
   */
  private readonly _fileService: FileService = inject(FileService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _utilsService: UtilsService = inject(UtilsService);
  private readonly _renderer: Renderer2 = inject(Renderer2);

  /**
   * displayedColumns: The columns to render in the table.
   */
  public readonly displayedColumns: string[] = ['name', 'description', 'actions'];
  public readonly dataSource: WritableSignal<{ name: string; }[]> = signal([]);

  public getFiles(): void {
    this._loadingService.show();

    this._fileService.getFiles()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (files: Files[]) => {
          this.dataSource.set(files);
          this._loadingService.hide();
        },
        error: (error) => {
          this._loadingService.hide();
          this.dataSource.set(null);
          console.error(error);
        }
      });
  }

  public uploadFile(): void {
    const dialogRef: MatDialogRef<AddEditFileComponent> = this._dialog.open(
      AddEditFileComponent, {
        ...BASIC_MATDIALOG_CONFIG,
        data: {
          isEditing: false
        }
      });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (file: Files) => {
          if (file) {
            this.getFiles();
          }
        }
      });
  }

  public editFile(element): void {
    const dialogRef: MatDialogRef<AddEditFileComponent> = this._dialog.open(
      AddEditFileComponent, {
        ...BASIC_MATDIALOG_CONFIG,
        data: {
          isEditing: true,
          file: element
        }
      });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (file: Files) => {
          if (file) {
            this.getFiles();
          }
        }
      });
  }

  public deleteFile(element: Files): void {
    this._loadingService.show();

    this._fileService.deleteFile(element.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (files: Files[]) => {
          this.dataSource.set(files);

          this._loadingService.hide();

          this._showToastrService.showToast(
            _t('Se ha eliminado el archivo exitosamente'),
            ToastrTypes.SUCCESS,
            true,
            _t('Felicidades!'),
            this._utilsService.getDefaultToastrConfig()
          );
        },
        error: (error) => {
          this._loadingService.hide();
          console.error(error);
        }
      });
  }

  public downloadFile(element: Files): void {
    this._loadingService.show();

    this._fileService.downloadFile(element.path)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (fileDownloaded: FileDownloaded) => {
          if (!fileDownloaded?.error) {
            // Download the file
            const blob = new Blob([fileDownloaded.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = this._renderer.createElement('a');
            this._renderer.setAttribute(link, 'href', url as string);
            this._renderer.setAttribute(link, 'download', element.path);
            link.click();
          } else {
            this._showToastrService.showToast(
              _t('Error al descargar el archivo'),
              ToastrTypes.ERROR,
              true,
              _t('Error'),
              this._utilsService.getDefaultToastrConfig()
            );
          }

          this._loadingService.hide();
        }
      });
  }

  ngOnInit(): void {
    this.getFiles();
  }
}
