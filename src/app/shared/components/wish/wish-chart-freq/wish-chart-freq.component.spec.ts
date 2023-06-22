import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishChartFreqComponent } from './wish-chart-freq.component';

describe('WishChartFreqComponent', () => {
  let component: WishChartFreqComponent;
  let fixture: ComponentFixture<WishChartFreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishChartFreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishChartFreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
