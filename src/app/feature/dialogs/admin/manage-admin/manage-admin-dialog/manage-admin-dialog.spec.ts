import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdminDialog } from './manage-admin-dialog';

describe('ManageAdminDialog', () => {
  let component: ManageAdminDialog;
  let fixture: ComponentFixture<ManageAdminDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAdminDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAdminDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
