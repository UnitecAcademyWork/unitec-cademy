import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { User } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  mudarSenha: FormGroup;
  submitted = false;
  user: User;
  atualTipo = 'password';
  atualBool = false;

  novaTipo = 'password';
  novaBool = false;

  confirmTipo = 'password';
  confirmBool = false;
  private subscription: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(
      this.authenticationService.currentUserValue.token
    );
  }

  ngOnInit(): void {
    this.mudarSenha = this.formBuilder.group(
      {
        antiga: ['', [Validators.required]],
        senha: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{6,}')]],
        confirm: ['', Validators.required],
      },
      {
        validator: MustMatch('senha', 'confirm'),
      }
    );
  }

  get s() {
    return this.mudarSenha.controls;
  }

  onChange() {
    this.submitted = true;
    if (this.mudarSenha.invalid) {
      return;
    }
    let nova: senhaNova = new senhaNova();
    nova.email = this.user.email;
    nova.senha = this.s.senha.value;
    this.subscription.push(
      this.userService.mudarSenha(nova).subscribe({
        next: (data) => this.toastr.success('password alterado com sucesso!'),
        error: (error) => this.toastr.error('Ocorreu um erro!'),
      })
    );
  }

  toggle(value: string) {
    switch (value) {
      case 'atual':
        this.atualBool = !this.atualBool;
        this.atualTipo = this.atualBool ? 'text' : 'password';
        break;

        case 'nova':
          this.novaBool = !this.novaBool;
          this.novaTipo = this.novaBool ? 'text' : 'password';
          break;
          case 'confirm':
            this.confirmBool = !this.confirmBool;
            this.confirmTipo = this.confirmBool ? 'text' : 'password';
            break;
    }
    console.log(this.atualBool);
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
}

export class senhaNova {
  email: string;
  senha: number;
}
