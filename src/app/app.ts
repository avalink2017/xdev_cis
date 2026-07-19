import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from "primeng/button";
import { Icon } from "./shared/components/icon/icon";
import { ThemeService } from './core/services/theme.service';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinner, Button, Icon, Toast, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private theme = inject(ThemeService);

  readonly error = signal(false);
  readonly shouldShowOverlay = signal(true);

  constructor() {
    this.theme.initialize();
    afterNextRender(() => this.theme.applyPreset(this.theme.themeState().preset));

    if (window.location.pathname.startsWith('/resetPassword')) {
      this.shouldShowOverlay.set(false);
      return;
    }

    this.auth.checkAuth().subscribe({
      next: () => this.resolve(),
      error: (err: HttpErrorResponse) => {
        if (this.auth.isOfflineError(err)) {
          this.error.set(true);
        } else {
          this.resolve();
        }
      },
    });
  }

  retry(): void {
    this.error.set(false);
    this.auth.checkAuth().subscribe({
      next: () => this.resolve(),
      error: (err: HttpErrorResponse) => {
        if (this.auth.isOfflineError(err)) {
          this.error.set(true);
        }
      },
    });
  }

  private resolve(): void {
    if (this.auth.authStatus() === 'unauthenticated' && !window.location.pathname.startsWith('/resetPassword')) {
      this.router.navigate(['/login']);
    }
    this.shouldShowOverlay.set(false);
  }
}