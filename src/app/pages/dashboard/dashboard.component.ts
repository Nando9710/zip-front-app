import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { marker as _t } from '@biesbjerg/ngx-translate-extract-marker';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    NgOptimizedImage
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
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
}
