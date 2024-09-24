import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreateFileForm, EditFile, Files } from '@interfaces/file';
import { LoadingService } from '@services/loading/loading.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileService } from '@services/file/file.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '../../utils/pipes/fileSize/file-size.pipe';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';
import { NOT_ALLOW_ONLY_BLANK_SPACES } from '@constants/regexes';

@Component({
  selector: 'app-add-edit-file',
  standalone: true,
  imports: [
    CapitalizePipe,
    UpperCasePipe,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    ReactiveFormsModule,
    FileSizePipe
  ],
  templateUrl: './add-edit-file.component.html',
  styleUrl: './add-edit-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditFileComponent {

  /**
     * Injections
     */
  private readonly _data: { isEditing: boolean, file: Files } = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef: MatDialogRef<AddEditFileComponent> = inject(MatDialogRef<AddEditFileComponent>);
  private readonly _fileService: FileService = inject(FileService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _utilsService: UtilsService = inject(UtilsService);
  private readonly _loggedInUserService: LoggedInUserService = inject(LoggedInUserService);

  public readonly selectedFile: WritableSignal<File> = signal(null);
  public readonly isEditing: WritableSignal<boolean> = signal(false);
  public readonly file: WritableSignal<Files> = signal(null);

  public readonly form: FormGroup<CreateFileForm> = new FormGroup({
    file: new FormControl({ value: null, disabled: false }, [Validators.required]),
    description: new FormControl({ value: null, disabled: false }, Validators.pattern(NOT_ALLOW_ONLY_BLANK_SPACES))
  });

  public readonly fileInput = viewChild.required<ElementRef>('file');

  public selectFile(event: { preventDefault: () => void; }): void {
    event.preventDefault();
    this.fileInput().nativeElement.click();
  }

  handleFileChange(event) {
    event.preventDefault();
    const file = (event.target as HTMLInputElement).files[0];

    if (!file) return;

    this.form.patchValue({ file: file.name });
    this.selectedFile.set(file);
    if (this.selectedFile().size >= 5000000) this.form.controls.file.setErrors({ maxFileSize: true });
  }

  public uploadFile(): void {
    this._loadingService.show();

    const { description } = this.form.value;
    const userId = this._loggedInUserService.getLoggedInUser()?.id;

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile());
    formData.append('description', description ?? '');
    formData.append('userId', userId);

    this._fileService.uploadFile(formData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (file: Files) => {
          this._loadingService.hide();
          this._dialogRef.close(file);

          this._showToastrService.showToast(
            _t('Se ha añadido el archivo exitosamente'),
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

  public editFile(): void {
    this._loadingService.show();

    const { description } = this.form.value;

    this._fileService.editFile({ description }, this.file().id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (file: Files) => {
          this._loadingService.hide();
          this._dialogRef.close(file);

          this._showToastrService.showToast(
            _t('Se ha editado el archivo exitosamente'),
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

  ngOnInit(): void {
    this.isEditing.set(this._data?.isEditing ?? false);
    this.file.set(this._data?.file);

    if (this.isEditing()) {
      this.form.patchValue({ ...this.file() });
      this.form.controls.file.disable();
    }
  }
}
