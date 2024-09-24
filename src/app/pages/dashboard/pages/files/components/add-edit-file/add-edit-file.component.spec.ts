import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFileComponent } from './add-edit-file.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEditFileComponent', () => {
  let component: AddEditFileComponent;
  let fixture: ComponentFixture<AddEditFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddEditFileComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TranslateModule,
        TranslateService,
        ToastrService,
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            isEditing: true,
            file: {
              id: '2',
              name: 'file.pdf',
              description: 'Descripción del archivo',
              path: 'file.pdf',
              user: {
                id: '1',
                name: 'Fernando',
                lastName: 'Carr',
                email: 'fernando@carr.com',
              }
            }
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
