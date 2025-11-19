import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-html-stripper',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './html-stripper-component.html',
  styleUrls: [`html-stripper-component.scss`]
})
export class HtmlStripperComponent {
  inputText = '';
  outputText = signal('');

  stripHtml(): void {
    const temp = document.createElement('div');
    temp.innerHTML = this.inputText;
    this.outputText.set(temp.textContent || temp.innerText || '');
  }

  clear(): void {
    this.inputText = '';
    this.outputText.set('');
  }

  async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.outputText());
  }
}
