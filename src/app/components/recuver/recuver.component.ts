import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-recuver',
  templateUrl: './recuver.component.html',
  styleUrls: ['./recuver.component.scss'],
})
export class RecuverComponent implements OnInit {
  recuverForm: FormGroup;
  submitted = false;
  error = false;
  good = false;
  changed = '';
  bad = ''
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/user']);
    }
  }

  ngOnInit(): void {
    this.recuverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  get f() {
    return this.recuverForm.controls;
  }

  onSubmit(): void {
    if (this.recuverForm.valid) {
      this.error = false;
      this.good = false;
      this.submitted = true;
      this.subscription = this.userService
        .recuverMail(this.f.email.value)
        .subscribe({
          next: (data) => {
            this.submitted = false;
            this.toastr.success('Email de recuperação enviado com sucesso!');
            this.changed = 'Por favor verifique o seu email';
            this.good = true;
          },
          error: (data) => {
            this.submitted = false;
            this.error = true;
            this.bad = 'Email não encontrado'
            this.toastr.error('Error ao enviar o email!');
          },
        });
    }
  }
}
