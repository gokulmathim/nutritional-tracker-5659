import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailySummaryComponent } from '../../components/daily-summary/daily-summary.component';
import { FoodSearchComponent } from '../../components/food-search/food-search.component';
import { FoodEntryFormComponent } from '../../components/food-entry-form/food-entry-form.component';
import { ApiService } from '../../core/services/api.service';
import { Food, FoodEntry, MealType } from '../../models/types';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DailySummaryComponent, FoodSearchComponent, FoodEntryFormComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPageComponent implements OnInit {
  todayIso = this.formatDate(new Date());
  selectedDate = this.todayIso;
  mealType: MealType = 'breakfast';

  selectedFood: Food | null = null;

  entries = signal<FoodEntry[]>([]);
  loadingEntries = signal<boolean>(false);

  editingId: string | null = null;
  editQuantity: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  onFoodAdd(ev: { food: Food; quantity: number }): void {
    const payload: FoodEntry = {
      date: this.selectedDate,
      mealType: this.mealType,
      foodId: ev.food.id,
      foodName: ev.food.name,
      quantity: ev.quantity
    };
    this.api.createEntry(payload).subscribe({
      next: () => {
        this.loadEntries();
        this.selectedFood = ev.food;
      }
    });
  }

  onDateChange(): void {
    this.loadEntries();
  }

  // PUBLIC_INTERFACE
  loadEntries(): void {
    /** Loads entries for selected date */
    this.loadingEntries.set(true);
    this.api.listEntriesByDate(this.selectedDate).subscribe({
      next: (list) => {
        this.entries.set(list || []);
        this.loadingEntries.set(false);
      },
      error: () => {
        this.entries.set([]);
        this.loadingEntries.set(false);
      }
    });
  }

  startEdit(e: FoodEntry): void {
    if (!e.id) return;
    this.editingId = e.id;
    this.editQuantity = e.quantity;
  }

  saveEdit(e: FoodEntry): void {
    if (!e.id) return;
    const newQty = Number(this.editQuantity);
    if (isNaN(newQty) || newQty <= 0) return;
    this.api.updateEntry(e.id, { quantity: newQty }).subscribe({
      next: () => {
        this.editingId = null;
        this.loadEntries();
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  deleteEntry(e: FoodEntry): void {
    if (!e.id) return;
    this.api.deleteEntry(e.id).subscribe({
      next: () => this.loadEntries()
    });
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
