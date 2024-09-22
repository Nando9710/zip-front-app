import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UpperCasePipe,
    NgClass,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    TranslateModule,
    NgOptimizedImage
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  /**
   * Injections
   */
  private readonly _authService: AuthService = inject(AuthService);

  /**
   * NavList
   */
  public readonly navList = [
    {
      title: _t('Archivos'),
      icon: 'folder',
      link: '/dashboard/files'
    },
    {
      title: _t('Usuarios'),
      icon: 'person',
      link: '/dashboard/users'
    }
  ];

  public logout(): void {
    this._authService.logout();
  }
}
