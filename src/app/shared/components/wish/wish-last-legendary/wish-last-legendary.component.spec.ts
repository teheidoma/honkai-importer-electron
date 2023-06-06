import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishLastLegendaryComponent } from './wish-last-legendary.component';

describe('WishLastLegendaryComponent', () => {
  let component: WishLastLegendaryComponent;
  let fixture: ComponentFixture<WishLastLegendaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishLastLegendaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishLastLegendaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
