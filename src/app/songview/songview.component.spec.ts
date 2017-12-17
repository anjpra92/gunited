import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongviewComponent } from './songview.component';

describe('SongviewComponent', () => {
  let component: SongviewComponent;
  let fixture: ComponentFixture<SongviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
