import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage: string | null = null;
  success = false;
  submitting = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') || '';
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.success = false;
    this.submitting = true;

    this.authService.confirmPasswordReset(this.token, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.changeDetectorRef.markForCheck();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.detail || 'Não foi possível redefinir a senha';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
