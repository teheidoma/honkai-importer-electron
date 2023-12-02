import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCellComponent } from './time-cell.component';

describe('TimeCellComponent', () => {
  let component: TimeCellComponent;
  let fixture: ComponentFixture<TimeCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
