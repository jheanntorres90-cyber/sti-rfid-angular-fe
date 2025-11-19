import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmin } from './manage-admin';

describe('ManageAdmin', () => {
  let component: ManageAdmin;
  let fixture: ComponentFixture<ManageAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
