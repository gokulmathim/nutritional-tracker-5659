import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FoodEntry } from '../../models/types';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.page.html',
  styleUrl: './history.page.css'
})
export class HistoryPageComponent implements OnInit {
  entries = signal<FoodEntry[]>([]);
  loading = signal<boolean>(false);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  // PUBLIC_INTERFACE
  load(): void {
    /** Loads last 30 entries history */
    this.loading.set(true);
    this.api.getHistory(30).subscribe({
      next: (res) => {
        this.entries.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.entries.set([]);
        this.loading.set(false);
      }
    });
  }
}
