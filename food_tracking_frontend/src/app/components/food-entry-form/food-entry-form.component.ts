import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Food, FoodEntry, MealType } from '../../models/types';

@Component({
  selector: 'app-food-entry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './food-entry-form.component.html',
  styleUrl: './food-entry-form.component.css'
})
export class FoodEntryFormComponent implements OnChanges {
  @Input() date!: string;
  @Input() mealType: MealType = 'breakfast';
  @Input() selectedFood?: Food | null;

  form: FormGroup;

  status: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      foodName: ['', [Validators.required]],
      quantity: [100, [Validators.required, Validators.min(1)]],
      calories: [0, [Validators.min(0)]],
      protein: [0, [Validators.min(0)]],
      carbs: [0, [Validators.min(0)]],
      fat: [0, [Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFood']) {
      if (this.selectedFood) {
        this.form.patchValue({
          foodName: this.selectedFood.name,
          calories: this.selectedFood.calories ?? 0,
          protein: this.selectedFood.protein ?? 0,
          carbs: this.selectedFood.carbs ?? 0,
          fat: this.selectedFood.fat ?? 0,
        });
      }
    }
  }

  // PUBLIC_INTERFACE
  submit(): void {
    /** Submits a new entry to the backend */
    if (!this.date) {
      this.errorMessage = 'Please select a date.';
      this.status = 'error';
      return;
    }
    if (this.form.invalid) return;

    const v = this.form.value;
    const payload: FoodEntry = {
      date: this.date,
      mealType: this.mealType,
      quantity: Number(v.quantity) || 0,
      foodName: v.foodName,
      calories: Number(v.calories) || undefined,
      protein: Number(v.protein) || undefined,
      carbs: Number(v.carbs) || undefined,
      fat: Number(v.fat) || undefined,
    };
    if (this.selectedFood?.id) {
      payload.foodId = this.selectedFood.id;
    }

    this.status = 'saving';
    this.api.createEntry(payload).subscribe({
      next: () => {
        this.status = 'saved';
        setTimeout(() => (this.status = 'idle'), 1200);
        this.form.markAsPristine();
      },
      error: (err) => {
        this.status = 'error';
        this.errorMessage = err?.error?.message || 'Failed to save entry.';
      }
    });
  }
}
