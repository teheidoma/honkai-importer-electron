import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishTableComponent } from './wish-table.component';

describe('WishTableComponent', () => {
  let component: WishTableComponent;
  let fixture: ComponentFixture<WishTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
