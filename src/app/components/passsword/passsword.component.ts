import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserService } from 'src/app/_services/user.service';
import { senhaNova } from '../user/change-password/change-password.component';

@Component({
  selector: 'app-passsword',
  templateUrl: './passsword.component.html',
  styleUrls: ['./passsword.component.scss'],
})
export class PassswordComponent implements OnInit {
  private token = '';
  private user: any;
  novaSenha: FormGroup;
  error = false;
  submitted = false;
  expired = false;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.novaSenha = this.formBuilder.group(
      {
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', Validators.required],
      },
      {
        validator: MustMatch('senha', 'confirm'),
      }
    );

    const helper = new JwtHelperService();
    this.token = this.route.snapshot.params['token'];
    if (helper.isTokenExpired(this.token)) {
      this.toastr.error('Token expirado!');
      this.expired = true;
    } else {
    }
    this.user = helper.decodeToken(this.token);
  }

  get f() {
    return this.novaSenha.controls;
  }

  onSubmit() {
    // console.log(this.user.email);
    if (this.novaSenha.invalid) {
      return;
    }
    this.submitted = true;
    let nova: senhaNova = new senhaNova();
    nova.email = this.user.email;
    nova.senha = this.f.senha.value;
    this.subscription = this.userService.alterarSenha(nova, this.token).subscribe({
      next: (data) => {this.toastr.success('password alterado com sucesso!'); this.router.navigate(['/login'])},
      error: (error) => {this.toastr.error('Ocorreu um erro!'); this.submitted = false},
    });
  }
}
