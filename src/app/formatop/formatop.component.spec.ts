import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatopComponent } from './formatop.component';

describe('FormatopComponent', () => {
  let component: FormatopComponent;
  let fixture: ComponentFixture<FormatopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
