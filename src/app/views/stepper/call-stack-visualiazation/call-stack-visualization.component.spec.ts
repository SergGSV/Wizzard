import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallStackVisualizationComponent } from './call-stack-visualization.component';

describe('CallStackVisualiazation', () => {
  let component: CallStackVisualizationComponent;
  let fixture: ComponentFixture<CallStackVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallStackVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallStackVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
