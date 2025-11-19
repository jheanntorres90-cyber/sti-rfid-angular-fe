import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfessor } from './manage-professor';

describe('ManageProfessor', () => {
  let component: ManageProfessor;
  let fixture: ComponentFixture<ManageProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProfessor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProfessor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
