import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-scrolled-list-with-sticky-first-and-last',
  imports: [CommonModule, MatListModule],
  templateUrl: './scrolled-list-with-sticky-first-and-last.html',
  styleUrl: './scrolled-list-with-sticky-first-and-last.css',
})
export class ScrolledListWithStickyFirstAndLast {
  @Input() items: Array<{ title: string; subtitle?: string }> = [];
}
