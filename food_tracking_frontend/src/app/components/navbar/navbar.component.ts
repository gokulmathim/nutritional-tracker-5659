import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthed = signal<boolean>(false);
  private sub?: Subscription;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthed.set(!!this.auth.getToken());
    this.sub = this.auth.isAuthenticated$.subscribe(v => this.isAuthed.set(v));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // PUBLIC_INTERFACE
  logout(): void {
    /** Logs out and navigates to login page */
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
