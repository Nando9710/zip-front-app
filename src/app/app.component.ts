import { afterNextRender, Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '@components/loading/loading.component';
import { DEFAULT_LANGUAGE } from '@constants/language';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '@services/loading/loading.service';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor () {
    afterNextRender(() => {
      this.initLanguageService();
    });
  }

  /**
   * Injections
  */
  private readonly _translate: TranslateService = inject(TranslateService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _loadingService: LoadingService = inject(LoadingService);

  public loading: WritableSignal<boolean> = signal(false);

  /**
   * Inicializa el servicio de traducción de la aplicación
   *
   */
  private initLanguageService(): void {
    let language: string = DEFAULT_LANGUAGE;

    language = localStorage.getItem('language') ?? DEFAULT_LANGUAGE;

    localStorage.setItem('language', language);
    this._translate.setDefaultLang(language);
    this._translate.use(language);
  }

  /**
   * Se subscribe al evento para lanzar la ventana de cargando de la aplicación
   */
  private isLoadingSubscribe(): void {
    this._loadingService.isLoading$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (isLoading) => {
          this.loading.set(isLoading as boolean);
        }
      });
  }

  ngOnInit(): void {
    this.isLoadingSubscribe();
  }
}
