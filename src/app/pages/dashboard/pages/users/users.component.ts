import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@interfaces/user';
import { UserService } from '@services/user.service';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';
import { LoadingService } from '@services/loading/loading.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CapitalizePipe,
    MatTableModule,
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
  private readonly _usersService: UserService = inject(UserService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);

  /**
   * displayedColumns: The columns to render in the table.
   */
  public readonly displayedColumns: string[] = ['name', 'email'];
  public readonly dataSource: WritableSignal<{ name: string; email: string; }[]> = signal([]);

  private getUsers(): void {
    this._loadingService.show();

    this._usersService.getUsers()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (users: User[]) => {
          const dataSource = users.map(user => ({
            name: `${user.name} ${user.lastName}`,
            email: user.email
          }));

          this.dataSource.set(dataSource);
          this._loadingService.hide();
          console.log(users);
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
