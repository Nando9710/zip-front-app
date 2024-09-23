import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFileComponent } from './add-edit-file.component';

describe('AddEditFileComponent', () => {
  let component: AddEditFileComponent;
  let fixture: ComponentFixture<AddEditFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditFileComponent]
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
