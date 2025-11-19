import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'app-split-view',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './split-view.html',
  styleUrl: './split-view.scss'
})
export class SplitViewComponent implements OnInit {
  items = Array.from({ length: 50 }, (_, i) => ({
    title: `Item ${i + 1}`,
    description: `Description for item ${i + 1} with some additional text to make it longer`
  }));

  language = 'typescript';
  code = `export class ComplexComponent implements OnInit, OnDestroy {
  private readonly destroySubject = new Subject<void>();
  public dataSource: MatTableDataSource<DataItem>;
  public displayedColumns: string[] = ['id', 'name', 'description', 'status', 'createdAt', 'updatedAt', 'actions'];

  constructor(
    private readonly service: DataService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<DataItem>([]);
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFilters();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private loadData(): void {
    this.service.getData()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.applyDefaultSorting();
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.showErrorMessage('Failed to load data. Please try again.');
        }
      });
  }

  private setupFilters(): void {
    this.dataSource.filterPredicate = (data: DataItem, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchStr) ||
             data.description.toLowerCase().includes(searchStr) ||
             data.status.toLowerCase().includes(searchStr);
    };
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public openDialog(item?: DataItem): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '600px',
      data: item || {}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(result => {
        if (result) {
          this.saveItem(result);
        }
      });
  }
}`;

  highlightedCode: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.highlightCode();
  }

  private highlightCode() {
    const highlighted = Prism.highlight(
      this.code,
      Prism.languages[this.language],
      this.language
    );
    this.highlightedCode = this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
