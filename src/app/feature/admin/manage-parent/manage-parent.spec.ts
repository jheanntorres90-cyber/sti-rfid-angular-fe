import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParent } from './manage-parent';

describe('ManageParent', () => {
  let component: ManageParent;
  let fixture: ComponentFixture<ManageParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageParent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageParent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
