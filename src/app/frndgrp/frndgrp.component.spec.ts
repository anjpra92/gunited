import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrndgrpComponent } from './frndgrp.component';

describe('FrndgrpComponent', () => {
  let component: FrndgrpComponent;
  let fixture: ComponentFixture<FrndgrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrndgrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrndgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
