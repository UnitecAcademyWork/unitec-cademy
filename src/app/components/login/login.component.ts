import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  error = false;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/user']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.subscription = this.authenticationService
        .login(this.f.email.value, this.f.senha.value)
        .pipe(first())
        .subscribe({
          next: () => {
            // get return url from route parameters or default to '/'
            const returnUrl =
              this.route.snapshot.queryParams['returnUrl'] || '/user';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            this.submitted = false;
            this.error = true;
          },
        });
    }
  }
}
