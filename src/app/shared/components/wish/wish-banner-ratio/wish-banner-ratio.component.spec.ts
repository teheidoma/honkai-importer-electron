import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishBannerRatioComponent } from './wish-banner-ratio.component';

describe('WishBannerRatioComponent', () => {
  let component: WishBannerRatioComponent;
  let fixture: ComponentFixture<WishBannerRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishBannerRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishBannerRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
