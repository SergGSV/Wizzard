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
    MatProgressSpinnerModule
  ],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

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
}
