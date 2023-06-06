import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishFeaturedComponent } from './wish-featured.component';

describe('WishFeaturedComponent', () => {
  let component: WishFeaturedComponent;
  let fixture: ComponentFixture<WishFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishFeaturedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
