import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrolledListWithStickyFirstAndLast } from './scrolled-list-with-sticky-first-and-last';

describe('ScrolledListWithStickyFirstAndLast', () => {
  let component: ScrolledListWithStickyFirstAndLast;
  let fixture: ComponentFixture<ScrolledListWithStickyFirstAndLast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrolledListWithStickyFirstAndLast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrolledListWithStickyFirstAndLast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
