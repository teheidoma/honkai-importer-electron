import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishChartRarityComponent } from './wish-chart-rarity.component';

describe('WishChartRarityComponent', () => {
  let component: WishChartRarityComponent;
  let fixture: ComponentFixture<WishChartRarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishChartRarityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishChartRarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
