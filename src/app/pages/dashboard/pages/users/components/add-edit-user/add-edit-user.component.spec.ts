import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";

import { AddEditUserComponent } from './add-edit-user.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEditUserComponent', () => {
  let component: AddEditUserComponent;
  let fixture: ComponentFixture<AddEditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddEditUserComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        TranslateService,
        ToastrService,
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            isEditing: true,
            user: {
              id: '1',
              name: 'Fernando',
              lastName: 'Carr',
              email: 'fernando@carr.com',
              files: [
                {
                  id: '2',
                  name: 'file.pdf',
                  description: 'Descripción del archivo',
                  path: 'file.pdf'
                }
              ]
            }
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
