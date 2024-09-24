import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from './app.component';
import { LoadingService } from "./core/services/loading/loading.service";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingService: LoadingService;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService
      ]
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService);
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  })

  it('should create the app', (): void => {
    expect(component).toBeTruthy();
  });

  it('should get loading status', (): void => {
    const loadingService: LoadingService = TestBed.inject(LoadingService);
    component.ngOnInit();

    loadingService.show();
    expect(component.loading()).toBeTruthy();

    loadingService.hide();
    expect(component.loading()).toBeFalsy();
  });
});
