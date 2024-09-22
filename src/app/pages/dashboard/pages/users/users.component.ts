import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
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
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { BASIC_MATDIALOG_CONFIG } from '@constants/basic-mat-dialog-config';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CapitalizePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  /**
   * Injections
   */
  private readonly _userService: UserService = inject(UserService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _utilsService: UtilsService = inject(UtilsService);

  /**
   * displayedColumns: The columns to render in the table.
   */
  public readonly displayedColumns: string[] = ['name', 'email', 'actions'];
  public readonly dataSource: WritableSignal<{ name: string; email: string; }[]> = signal([]);

  private getUsers(): void {
    this._loadingService.show();

    this._userService.getUsers()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (users: User[]) => {
          this.dataSource.set(users);
          this._loadingService.hide();
          console.log(users);
        },
        error: (error) => {
          this._loadingService.hide();
          console.error(error);
        }
      });
  }

  public addUser(): void {
    const dialogRef: MatDialogRef<AddEditUserComponent> = this._dialog.open(
      AddEditUserComponent, {
        ...BASIC_MATDIALOG_CONFIG,
        data: {
          isEditing: false
        }
      });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: User) => {
          if (user) {
            this.getUsers();
          }
        }
      });
  }

  public editUser(element): void {
    const dialogRef: MatDialogRef<AddEditUserComponent> = this._dialog.open(
      AddEditUserComponent, {
        ...BASIC_MATDIALOG_CONFIG,
        data: {
          isEditing: true,
          user: element
        }
      });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: User) => {
          if (user) {
            this.getUsers();
          }
        }
      });
  }

  public deleteUser(element): void {
    this._loadingService.show();

    this._userService.deleteUser(element.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (users: User[]) => {
          this.dataSource.set(users);

          this._loadingService.hide();

          this._showToastrService.showToast(
            _t('Se ha eliminado el usuario exitosamente'),
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
    this.getUsers();
    console.log('object');
  }
}
