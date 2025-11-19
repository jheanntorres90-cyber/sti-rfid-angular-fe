import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudent } from './manage-student';

describe('ManageStudent', () => {
  let component: ManageStudent;
  let fixture: ComponentFixture<ManageStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
