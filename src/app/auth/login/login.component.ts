import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage: string | null = null;
  submitting = false;

  constructor(private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.submitting = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.submitting = false;
        const redirectTo = this.router.parseUrl(this.router.url).queryParams['redirectTo'];
        this.router.navigateByUrl(redirectTo || '/welcome');
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Usuário ou senha inválidos';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
