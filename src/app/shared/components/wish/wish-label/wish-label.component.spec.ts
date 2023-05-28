import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishLabelComponent } from './wish-label.component';

describe('WishLabelComponent', () => {
  let component: WishLabelComponent;
  let fixture: ComponentFixture<WishLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
