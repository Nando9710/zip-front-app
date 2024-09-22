import { NgOptimizedImage, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EMAIL_REGEX } from '@constants/regexes';
import { LoginForm, LoginIn, LoginOut } from '@interfaces/auth';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { AuthService } from '@services/auth/auth.service';
import { LoadingService } from '@services/loading/loading.service';
import { ShowToastrService, ToastrTypes } from '@services/show-toastr/show-toastr.service';
import { UtilsService } from '@services/utils/utils.service';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { Router } from '@angular/router';
import { LoggedInUserService } from '@services/logged-in-user/logged-in-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TitleCasePipe,
    CapitalizePipe,
    UpperCasePipe,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  /**
   * Injections
   */
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);
  private readonly _showToastrService: ShowToastrService = inject(ShowToastrService);
  private readonly _utilsService: UtilsService = inject(UtilsService);
  private readonly _router: Router = inject(Router);
  private readonly _loggedInUserService: LoggedInUserService = inject(LoggedInUserService);

  public hide: WritableSignal<boolean> = signal(false);

  public readonly form: FormGroup<LoginForm> = new FormGroup({
    email: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(EMAIL_REGEX)]),
    password: new FormControl({ value: null, disabled: false }, [Validators.required])
  });

  public login(): void {
    this._loadingService.show();
    this._loggedInUserService.removeUserCookies();

    this._authService.login({ ...this.form.value as LoginIn })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: LoginOut) => {
          this._loadingService.hide();

          this._showToastrService.showToast(
            _t('Ha iniciado sesión exitosamente'),
            ToastrTypes.SUCCESS,
            true,
            _t('Felicidades!'),
            this._utilsService.getDefaultToastrConfig()
          );

          this._loggedInUserService.setTokenOfUser(user.accessToken);
          this._loggedInUserService.setUser(user);

          this._router.navigate(['dashboard']);
        },
        error: (error) => {
          this._loadingService.hide();
          console.error(error);
        }
      });
  }

}
