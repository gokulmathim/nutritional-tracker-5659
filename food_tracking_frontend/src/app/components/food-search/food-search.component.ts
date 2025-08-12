import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { Food, PagedResult } from '../../models/types';

@Component({
  selector: 'app-food-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './food-search.component.html',
  styleUrl: './food-search.component.css'
})
export class FoodSearchComponent implements OnInit, OnDestroy {
  query = '';
  results = signal<Food[]>([]);
  loading = signal<boolean>(false);
  private search$ = new Subject<string>();
  private sub?: Subscription;

  @Output() add = new EventEmitter<{ food: Food; quantity: number }>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.sub = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loading.set(true);
          return this.api.searchFoods(q || '', 1, 10);
        })
      )
      .subscribe({
        next: (res: PagedResult<Food>) => {
          this.results.set(res.items || []);
          this.loading.set(false);
        },
        error: () => {
          this.results.set([]);
          this.loading.set(false);
        }
      });
    // Trigger initial load with empty query
    this.search$.next('');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onInputChange(): void {
    this.search$.next(this.query);
  }

  // PUBLIC_INTERFACE
  addFood(food: Food): void {
    /** Emits a selected food with a default quantity of 100g for convenience */
    this.add.emit({ food, quantity: 100 });
  }
}
