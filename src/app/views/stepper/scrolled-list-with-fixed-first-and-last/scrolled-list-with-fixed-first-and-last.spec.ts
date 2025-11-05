import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrolledListWithFixedFirstAndLast } from './scrolled-list-with-fixed-first-and-last';

describe('ScrolledListWithFixedFirstAndLast', () => {
  let component: ScrolledListWithFixedFirstAndLast;
  let fixture: ComponentFixture<ScrolledListWithFixedFirstAndLast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrolledListWithFixedFirstAndLast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrolledListWithFixedFirstAndLast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
