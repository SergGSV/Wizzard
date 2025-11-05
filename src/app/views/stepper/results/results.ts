import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {QueryResultItem} from '../stepper.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnChanges {
  @Input() elements: QueryResultItem[] = [];

  scrollableElements: QueryResultItem[] = [];
  firstElement: QueryResultItem | null = null;
  lastElement: QueryResultItem | null = null;
  selectedElement: QueryResultItem | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elements'] && this.elements) {
      this.initializeElements();
    }
  }

  private initializeElements(): void {
    if (this.elements.length === 0) {
      this.resetElements();
      return;
    }

    this.firstElement = this.elements[0];
    this.lastElement = this.elements[this.elements.length - 1];

    // Елементи для скролу (всі крім першого та останнього)
    if (this.elements.length > 2) {
      this.scrollableElements = this.elements.slice(1, -1);
    } else {
      this.scrollableElements = [];
    }

    // За замовчуванням обираємо другий елемент (індекс 1),
    // або перший, якщо є тільки один елемент
    this.selectedElement = this.elements.length > 1
      ? this.elements[1]
      : this.firstElement;
  }

  private resetElements(): void {
    this.scrollableElements = [];
    this.firstElement = null;
    this.lastElement = null;
    this.selectedElement = null;
  }

  selectElement(element: QueryResultItem): void {
    this.selectedElement = element;
  }

  isSelected(element: QueryResultItem | null): boolean {
    return element !== null && this.selectedElement === element;
  }

  getElementLabel(element: QueryResultItem, index: number): string {
    // Якщо є перший внутрішній елемент з label
    return element.elements[0]?.label || `Element ${index + 1}`;
  }
}
