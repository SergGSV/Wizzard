import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {DataItem} from '../../interfaces/data-item';
import {DataService} from '../../services/data-service';
import {CallStackVisualizationComponent} from './call-stack-visualiazation/call-stack-visualization.component';
import {Results} from './results/results';
import {
  ScrolledListWithFixedFirstAndLast
} from './scrolled-list-with-fixed-first-and-last/scrolled-list-with-fixed-first-and-last';
import {
  ScrolledListWithStickyFirstAndLast
} from './scrolled-list-with-sticky-first-and-last/scrolled-list-with-sticky-first-and-last';
import {CodeViewerComponent} from './code-viewer.component/code-viewer.component';
import {SplitViewComponent} from './split-view/split-view';


export interface QueryElement {
  code: string;
  columnNumber: number;
  fileName: string;
  label: string;
  lineNumber: number;
  name: string;
  order: number;
}

export interface QueryResultItem {
  elements: QueryElement[];
}


@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CallStackVisualizationComponent,
    Results,
    ScrolledListWithFixedFirstAndLast,
    ScrolledListWithStickyFirstAndLast,
    CodeViewerComponent,
    SplitViewComponent
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;


  filteredElements: QueryResultItem[] = [];


  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;

  allItems: DataItem[] = [];
  sources: DataItem[] = [];
  sinks: DataItem[] = [];

  filteredSources: DataItem[] = [];
  filteredSinks: DataItem[] = [];

  selectedSource: DataItem | null = null;
  selectedSink: DataItem | null = null;

  sourceFilter = '';
  sinkFilter = '';

  loading = false;
  submitSuccess = false;
  submitError = false;
  serverResponse: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      sourceCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      sinkCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({});

    this.loadData();


    // Фільтруємо елементи з elements.length >= 2
    this.filteredElements = this.mockData.filter(item =>
      item.elements && item.elements.length >= 2
    );
  }

  loadData(): void {
    this.loading = true;
    this.dataService.getDataItems().subscribe({
      next: (items) => {
        this.allItems = items;
        this.sources = items.filter(item => item.type === 'source');
        this.sinks = items.filter(item => item.type === 'sink');
        this.filteredSources = [...this.sources];
        this.filteredSinks = [...this.sinks];
        this.loading = false;
      },
      error: (error) => {
        console.error('Помилка завантаження даних:', error);
        this.loading = false;
      }
    });
  }

  filterSources(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.sourceFilter = value;
    this.filteredSources = this.sources.filter(source =>
      source.name.toLowerCase().includes(value)
    );
  }

  filterSinks(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.sinkFilter = value;
    this.filteredSinks = this.sinks.filter(sink =>
      sink.name.toLowerCase().includes(value)
    );
  }

  selectSource(source: DataItem): void {
    this.selectedSource = source;
    this.firstFormGroup.patchValue({ sourceCtrl: source.id });
  }

  selectSink(sink: DataItem): void {
    this.selectedSink = sink;
    this.secondFormGroup.patchValue({ sinkCtrl: sink.id });
  }

  submitPair(): void {
    if (this.selectedSource && this.selectedSink) {
      this.loading = true;
      this.submitSuccess = false;
      this.submitError = false;

      this.dataService.submitPair(this.selectedSource.id, this.selectedSink.id).subscribe({
        next: (response) => {
          console.log('Успішно відправлено:', response);
          this.serverResponse = response;
          this.submitSuccess = true;
          this.loading = false;
          this.stepper.next();
        },
        error: (error) => {
          console.error('Помилка відправки:', error);
          this.submitError = true;
          this.loading = false;
        }
      });
    }
  }

  reset(): void {
    this.selectedSource = null;
    this.selectedSink = null;
    this.sourceFilter = '';
    this.sinkFilter = '';
    this.filteredSources = [...this.sources];
    this.filteredSinks = [...this.sinks];
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.submitSuccess = false;
    this.submitError = false;
    this.serverResponse = null;
  }




  mockData: QueryResultItem[] = [
    {
      elements: [
        {
          code: "pg.query(sql)",
          columnNumber: 20,
          fileName: "quickmed-playground-main/src/database.ts",
          label: "CALL",
          lineNumber: 12,
          name: "query",
          order: 1
        },
        {
          code: "db.execute(query)",
          columnNumber: 15,
          fileName: "quickmed-playground-main/src/database.ts",
          label: "FUNCTION",
          lineNumber: 45,
          name: "execute",
          order: 2
        }
      ]
    },
    {
      elements: [
        {
          code: "userService.findById(id)",
          columnNumber: 10,
          fileName: "quickmed-playground-main/src/services/user.service.ts",
          label: "CALL",
          lineNumber: 23,
          name: "findById",
          order: 1
        },
        {
          code: "repository.get(userId)",
          columnNumber: 18,
          fileName: "quickmed-playground-main/src/services/user.service.ts",
          label: "CALL",
          lineNumber: 56,
          name: "get",
          order: 2
        },
        {
          code: "cache.retrieve(key)",
          columnNumber: 25,
          fileName: "quickmed-playground-main/src/services/user.service.ts",
          label: "FUNCTION",
          lineNumber: 78,
          name: "retrieve",
          order: 3
        }
      ]
    },
    {
      elements: [
        {
          code: "authController.login()",
          columnNumber: 5,
          fileName: "quickmed-playground-main/src/controllers/auth.controller.ts",
          label: "CALL",
          lineNumber: 89,
          name: "login",
          order: 1
        }
      ]
    },
    {
      elements: [
        {
          code: "validator.checkEmail(email)",
          columnNumber: 12,
          fileName: "quickmed-playground-main/src/utils/validator.ts",
          label: "CALL",
          lineNumber: 34,
          name: "checkEmail",
          order: 1
        },
        {
          code: "regex.test(pattern)",
          columnNumber: 8,
          fileName: "quickmed-playground-main/src/utils/validator.ts",
          label: "FUNCTION",
          lineNumber: 67,
          name: "test",
          order: 2
        }
      ]
    },
    {
      elements: Array.from({ length: 52 }, (_, i) => ({
        code: `api.endpoint${i + 1}()`,
        columnNumber: 10 + i,
        fileName: "quickmed-playground-main/src/api/endpoints.ts",
        label: i % 3 === 0 ? "CALL" : "FUNCTION",
        lineNumber: 100 + i * 2,
        name: `endpoint${i + 1}`,
        order: i + 1
      }))
    },
    {
      elements: [
        {
          code: "middleware.authenticate()",
          columnNumber: 15,
          fileName: "quickmed-playground-main/src/middleware/auth.ts",
          label: "CALL",
          lineNumber: 12,
          name: "authenticate",
          order: 1
        },
        {
          code: "jwt.verify(token)",
          columnNumber: 20,
          fileName: "quickmed-playground-main/src/middleware/auth.ts",
          label: "FUNCTION",
          lineNumber: 34,
          name: "verify",
          order: 2
        },
        {
          code: "token.decode(str)",
          columnNumber: 18,
          fileName: "quickmed-playground-main/src/middleware/auth.ts",
          label: "FUNCTION",
          lineNumber: 56,
          name: "decode",
          order: 3
        }
      ]
    },
    {
      elements: Array.from({ length: 20 }, (_, i) => ({
        code: `helper.util${i + 1}()`,
        columnNumber: 5 + i,
        fileName: "quickmed-playground-main/src/helpers/utils.ts",
        label: "UTILITY",
        lineNumber: 50 + i * 3,
        name: `util${i + 1}`,
        order: i + 1
      }))
    }
  ];

  listItems = [
    { title: 'Перший елемент (фіксований)', subtitle: 'Завжди зверху' },
    { title: 'Елемент 2', subtitle: 'Скролюється' },
    { title: 'Елемент 3', subtitle: 'Скролюється' },
    { title: 'Елемент 4', subtitle: 'Скролюється' },
    { title: 'Елемент 5', subtitle: 'Скролюється' },
    { title: 'Елемент 6', subtitle: 'Скролюється' },
    { title: 'Елемент 7', subtitle: 'Скролюється' },
    { title: 'Елемент 8', subtitle: 'Скролюється' },
    { title: 'Елемент 9', subtitle: 'Скролюється' },
    { title: 'Елемент 10', subtitle: 'Скролюється' },
    { title: 'Останній елемент (фіксований)', subtitle: 'Завжди знизу' }
  ];
}
