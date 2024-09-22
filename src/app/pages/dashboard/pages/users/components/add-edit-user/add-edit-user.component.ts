import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CreateUser, CreateUserForm, EditUser, User } from '@interfaces/user';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { MatInputModule } from '@angular/material/input';
import { EMAIL_REGEX, NOT_ALLOW_ONLY_BLANK_SPACES, PASSWORD_REGEX } from '@constants/regexes';
import { UserService } from '@services/user.service';
import { LoadingService } from '@services/loading/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-add-edit-user',
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
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUserComponent {
  /**
     * Injections
     */
  private readonly _data: { isEditing: boolean, user: User } = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef: MatDialogRef<AddEditUserComponent> = inject(MatDialogRef<AddEditUserComponent>);
  private readonly _userService: UserService = inject(UserService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _utilsService: UtilsService = inject(UtilsService);

  public readonly isEditing: WritableSignal<boolean> = signal(false);
  public readonly user: WritableSignal<User> = signal(null);

  public readonly form: FormGroup<CreateUserForm> = new FormGroup({
    name: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(NOT_ALLOW_ONLY_BLANK_SPACES)]),
    lastName: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(NOT_ALLOW_ONLY_BLANK_SPACES)]),
    email: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(EMAIL_REGEX)]),
    password: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(PASSWORD_REGEX)])
  });

  public createUser(): void {
    this._loadingService.show();

    this._userService.createUser({ ...this.form.value as CreateUser })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: User) => {
          this._loadingService.hide();
          this._dialogRef.close(user);

          this._showToastrService.showToast(
            _t('Se ha creado el usuario exitosamente'),
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

  public editUser(): void {
    this._loadingService.show();

    this._userService.editUser({ ...this.form.value as EditUser }, this.user().id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: User) => {
          this._loadingService.hide();
          this._dialogRef.close(user);

          this._showToastrService.showToast(
            _t('Se ha editado el usuario exitosamente'),
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
    this.user.set(this._data?.user);

    console.log(this._data);

    if (this.isEditing()) {
      this.form.patchValue({ ...this.user() });
      this.form.controls.password.disable();
    }
  }
}
