import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DailySummary } from '../../models/types';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-summary.component.html',
  styleUrl: './daily-summary.component.css'
})
export class DailySummaryComponent implements OnChanges {
  @Input() date!: string;

  loading = signal<boolean>(false);
  summary = signal<DailySummary | null>(null);

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && this.date) {
      this.load();
    }
  }

  // PUBLIC_INTERFACE
  load(): void {
    /** Loads daily summary for selected date */
    if (!this.date) return;
    this.loading.set(true);
    this.api.getDailySummary(this.date).subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.summary.set({ date: this.date, calories: 0, protein: 0, carbs: 0, fat: 0 });
        this.loading.set(false);
      }
    });
  }
}
