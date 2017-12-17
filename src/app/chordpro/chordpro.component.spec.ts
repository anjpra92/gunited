import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordproComponent } from './chordpro.component';

describe('ChordproComponent', () => {
  let component: ChordproComponent;
  let fixture: ComponentFixture<ChordproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChordproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
