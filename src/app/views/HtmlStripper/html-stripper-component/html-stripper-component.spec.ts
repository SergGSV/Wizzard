import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlStripperComponent } from './html-stripper-component';

describe('HtmlStripperComponent', () => {
  let component: HtmlStripperComponent;
  let fixture: ComponentFixture<HtmlStripperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlStripperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlStripperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
