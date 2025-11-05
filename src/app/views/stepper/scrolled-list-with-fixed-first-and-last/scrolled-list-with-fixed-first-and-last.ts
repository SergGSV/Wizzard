import {Component, Input} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-scrolled-list-with-fixed-first-and-last',
  imports: [CommonModule, MatListModule],
  templateUrl: './scrolled-list-with-fixed-first-and-last.html',
  styleUrl: './scrolled-list-with-fixed-first-and-last.css',
})
export class ScrolledListWithFixedFirstAndLast {
  @Input() items: Array<{ title: string; subtitle?: string }> = [];

  get middleItems(): Array<{ title: string; subtitle?: string }> {
    if (!this.items || this.items.length <= 2) {
      return [];
    }
    return this.items.slice(1, -1);
  }
}
