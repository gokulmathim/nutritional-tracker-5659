import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AuthResponse, DailySummary, Food, FoodEntry, PagedResult, RegisterPayload, UserCredentials } from '../../models/types';

/**
 * PUBLIC_INTERFACE
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  private get base(): string {
    return this.config.getApiBaseUrl();
  }

  // PUBLIC_INTERFACE
  register(payload: RegisterPayload): Observable<AuthResponse> {
    /** Register a user; returns JWT token and user profile */
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, payload);
  }

  // PUBLIC_INTERFACE
  login(payload: UserCredentials): Observable<AuthResponse> {
    /** Login; returns JWT token and user profile */
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload);
  }

  // PUBLIC_INTERFACE
  searchFoods(query: string, page = 1, pageSize = 10): Observable<PagedResult<Food>> {
    /** Search foods by query string */
    const params = new HttpParams()
      .set('q', query)
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<PagedResult<Food>>(`${this.base}/foods/search`, { params });
  }

  // PUBLIC_INTERFACE
  listEntriesByDate(dateIso: string): Observable<FoodEntry[]> {
    /** Get food entries for a given date (yyyy-MM-dd) */
    const params = new HttpParams().set('date', dateIso);
    return this.http.get<FoodEntry[]>(`${this.base}/entries`, { params });
  }

  // PUBLIC_INTERFACE
  createEntry(entry: FoodEntry): Observable<FoodEntry> {
    /** Create a new food entry for a date */
    return this.http.post<FoodEntry>(`${this.base}/entries`, entry);
  }

  // PUBLIC_INTERFACE
  updateEntry(id: string, entry: Partial<FoodEntry>): Observable<FoodEntry> {
    /** Update an existing food entry */
    return this.http.put<FoodEntry>(`${this.base}/entries/${encodeURIComponent(id)}`, entry);
  }

  // PUBLIC_INTERFACE
  deleteEntry(id: string): Observable<void> {
    /** Delete a food entry */
    return this.http.delete<void>(`${this.base}/entries/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  getDailySummary(dateIso: string): Observable<DailySummary> {
    /** Get daily nutritional summary for the specified date */
    const params = new HttpParams().set('date', dateIso);
    return this.http.get<DailySummary>(`${this.base}/summary`, { params });
  }

  // PUBLIC_INTERFACE
  getHistory(limit = 30): Observable<FoodEntry[]> {
    /** Get latest N entries (history) */
    const params = new HttpParams().set('limit', limit);
    return this.http.get<FoodEntry[]>(`${this.base}/entries/history`, { params });
  }
}
