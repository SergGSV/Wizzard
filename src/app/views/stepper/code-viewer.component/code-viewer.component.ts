import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import Prism from 'prismjs';

// Імпорт мов для PrismJS (додайте потрібні)
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';

interface CodeCache {
  filePath: string;
  code: string;
}

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './code-viewer.component.html',
  styleUrls: ['./code-viewer.component.scss']
})
export class CodeViewerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() filePath!: string;
  @Input() language: string = 'typescript';
  @Input() lineNumber!: number;
  @Input() highlightText!: string;

  @ViewChild('codeContainer') codeContainer!: ElementRef;

  code: string = '';
  highlightedCode: SafeHtml = '';
  isLoading: boolean = false;
  error: string | null = null;

  private cache: CodeCache | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private codeService: CodeService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filePath'] || changes['language'] || changes['lineNumber'] || changes['highlightText']) {
      if (changes['filePath'] && !changes['filePath'].firstChange) {
        this.loadCode();
      } else if (!changes['filePath'] && (changes['lineNumber'] || changes['highlightText'])) {
        this.updateHighlighting();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.code && this.lineNumber) {
      this.scrollToLine();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCode(): void {
    if (this.cache && this.cache.filePath === this.filePath) {
      this.code = this.cache.code;
      this.updateHighlighting();
      this.cdr.detectChanges();
      setTimeout(() => this.scrollToLine(), 100);
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.codeService.getFileContent(this.filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (code) => {
          this.code = code;
          this.cache = { filePath: this.filePath, code: this.code };
          this.updateHighlighting();
          this.isLoading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.scrollToLine(), 100);
        },
        error: (err) => {
          this.error = 'Не вдалося завантажити файл';
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  private updateHighlighting(): void {
    if (!this.code) return;

    const lines = this.code.split('\n');
    const grammar = Prism.languages[this.language] || Prism.languages['javascript'];

    console.log('Target line number:', this.lineNumber);
    console.log('Highlight text:', this.highlightText);

    const processedLines = lines.map((line, index) => {
      const lineNum = index + 1;
      let highlightedLine = '';

      // Додаємо підсвічування тексту якщо потрібно
      if (lineNum === this.lineNumber && this.highlightText && line.includes(this.highlightText)) {
        console.log(`Processing target line ${lineNum}:`, line);
        // Знаходимо позицію тексту в оригінальному рядку
        const textIndex = line.indexOf(this.highlightText);
        const beforeText = line.substring(0, textIndex);
        const matchText = line.substring(textIndex, textIndex + this.highlightText.length);
        const afterText = line.substring(textIndex + this.highlightText.length);

        // Застосовуємо PrismJS до кожної частини окремо
        const beforeHighlighted = beforeText ? Prism.highlight(beforeText, grammar, this.language) : '';
        const matchHighlighted = Prism.highlight(matchText, grammar, this.language);
        const afterHighlighted = afterText ? Prism.highlight(afterText, grammar, this.language) : '';

        highlightedLine = beforeHighlighted + '<mark class="highlight-text">' + matchHighlighted + '</mark>' + afterHighlighted;
      } else {
        // Застосовуємо PrismJS до всього рядка
        highlightedLine = Prism.highlight(line, grammar, this.language);
      }

      const isTargetLine = lineNum === this.lineNumber ? 'data-target-line="true"' : '';
      const lineHtml = `<span class="line-number">${lineNum}</span><span class="line-content" ${isTargetLine}>${highlightedLine}</span>`;

      if (lineNum === this.lineNumber) {
        console.log('Generated HTML for target line:', lineHtml);
      }

      return lineHtml;
    }).join('\n');

    this.highlightedCode = this.sanitizer.bypassSecurityTrustHtml(processedLines);
    console.log('Total lines processed:', lines.length);
  }

  private scrollToLine(): void {
    if (!this.lineNumber) return;

    const attemptScroll = (attempts: number = 0) => {
      if (attempts > 20) {
        console.warn('Failed to find target line after 20 attempts');
        return;
      }

      if (this.codeContainer?.nativeElement) {
        const targetElement = this.codeContainer.nativeElement.querySelector('[data-target-line]');
        if (targetElement) {
          console.log('Scrolling to line:', this.lineNumber);
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.log(`Attempt ${attempts + 1}: Target element not found, retrying...`);
          setTimeout(() => attemptScroll(attempts + 1), 50);
        }
      } else {
        console.log(`Attempt ${attempts + 1}: Container not found, retrying...`);
        setTimeout(() => attemptScroll(attempts + 1), 50);
      }
    };

    attemptScroll();
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Мок-сервіс для отримання коду
@Injectable({ providedIn: 'root' })
export class CodeService {
  getFileContent(filePath: string): Observable<string> {
    // Симуляція затримки мережі
    return of(null).pipe(
      delay(800),
      map(() => {
        // Мок-дані - довгий код для демонстрації скролу
        const mockCode = `import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.http.get<User[]>('/api/users')
      .pipe(
        map(users => users.filter(u => u.email)),
        catchError(err => {
          this.error = 'Failed to load users';
          return [];
        })
      )
      .subscribe(users => {
        this.users = users;
        this.loading = false;
      });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.http.delete(\`/api/users/\${id}\`)
      .subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
  }

  updateUser(user: User): void {
    this.http.put(\`/api/users/\${user.id}\`, user)
      .subscribe(updated => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
      });
  }

  private validateEmail(email: string): boolean {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA');
  }
}`;

        return mockCode;
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
