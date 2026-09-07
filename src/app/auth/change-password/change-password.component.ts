import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage: string | null = null;
  success = false;
  submitting = false;

  constructor(private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.success = false;
    this.submitting = true;

    this.authService.changePassword(this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.authService.logout();
        this.changeDetectorRef.markForCheck();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.detail || 'Não foi possível alterar a senha';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
