import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {StepperComponent} from './views/stepper/stepper.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StepperComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Wizzard');
}
