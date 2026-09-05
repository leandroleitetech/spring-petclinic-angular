import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  username = '';
  message: string | null = null;
  errorMessage: string | null = null;
  submitting = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.message = null;
    this.errorMessage = null;
    this.submitting = true;

    this.authService.requestPasswordReset(this.username).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.token) {
          this.router.navigate(['/reset-password'], {queryParams: {token: response.token}});
        } else {
          this.message = 'Se o usuário existir, você receberá instruções por e-mail.';
        }
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Não foi possível processar a solicitação';
      }
    });
  }
}
