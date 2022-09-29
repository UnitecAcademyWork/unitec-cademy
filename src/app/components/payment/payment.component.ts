import { Horario } from 'src/app/_models/user/horario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { User } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';
import { ToastrService } from 'ngx-toastr';
import { HorarioService } from 'src/app/_services/horario.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  curso: any;
  user: User = new User();
  file: File;
  submitted = false;
  imgName: any;
  isPayed: boolean;
  prev: number;
  previews: string;
  horario: Horario = new Horario();
  discount = false;
  ownerDisc = false;
  re = /\?/gi;
  er = /\.|\,/gi;
  discValue = 0;
  totalDisc = 0;
  resto = 0;
  displayDesc = 0;
  private subscription: Subscription[] = [];
  cupao = '';
  tempTemp: any;

  constructor(
    private formBuilder: FormBuilder,
    private cursosService: CursosService,
    private router: Router,
    private auth: AuthenticationService,
    private location: Location,
    private userService: UserService,
    private toastr: ToastrService,
    private horarioSErvice: HorarioService
  ) {
    this.subscription.push(
      this.cursosService.currentPayed.subscribe((data) => (this.isPayed = data))
    );
  }

  ngOnInit(): void {
    const help = new JwtHelperService();
    this.user = help.decodeToken(this.auth.currentUserValue.token);

    this.subscription.push(
      this.horarioSErvice.currentHorario.subscribe({
        next: (data) => (this.horario = data),
      })
    );

    this.subscription.push(
      this.cursosService.currentCurso.subscribe((data) => {
        this.curso = data;
        if (this.curso === null) {
          this.location.back();
        }
        let temp = +this.curso.valor.replace(this.er, '');
        this.tempTemp = temp;
        this.userService.getAluno(this.user.id).subscribe((data) => {
          if (data.AlunosTotalDesconto) {
            this.totalDisc = data.AlunosTotalDesconto.valor_total;
            this.ownerDisc = true;
            if (temp <= this.totalDisc) {
              this.prev = 0;
              this.resto = temp - this.totalDisc;
              this.discValue = temp;
            } else {
              this.discValue = this.totalDisc;
              this.prev = temp - this.totalDisc;
              this.resto = this.totalDisc - temp;
            }
          }
        });
        this.userService.getDescontoStatus(this.user.id).subscribe({
          next: (data) => {
            this.discValue = data.descunto_conv;
            if (data.descunto_conv !== 0) {
              this.discount = true;
              this.prev = temp - temp * 0.1;
            }
          },
          error: () => {
            this.discount = false;
          },
        });
      })
    );

    const helper = new JwtHelperService();

    if (this.auth.currentUserValue) {
      this.user = helper.decodeToken(this.auth.currentUserValue.token);
    }

    if (this.horario) {
      this.horario.id_aluno = this.user.id;
    }

    this.paymentForm = this.formBuilder.group({
      payment: ['ficheiro'],
    });
  }

  ngOnDestroy() {
    this.horarioSErvice.changeHorario(null);
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  onUpload(event) {
    let temp1 = event.target.files[0];
    let temp = temp1.name.split('.').pop();
    if (temp !== 'png' && temp !== 'jpg' && temp !== 'jpeg') {
      this.toastr.info('Formato não suportado');
      this.toastr.info('formatos permitidos .jpg, .jpeg, .png');
    } else {
      this.file = event.target.files[0];
      this.imgName = this.file.name;
    }
  }

  get f() {
    return this.paymentForm.controls;
  }

  onSubmit() {
    if (this.file === undefined) {
      this.toastr.error('Por favor anexe o comprovativo!');
      return;
    }
    let temp = +this.curso.valor.replace(this.er, '');
    this.submitted = true;
    if (!this.isPayed) {
      this.userService.getDescontoStatus(this.user.id).subscribe({
        next: (data) => {
          if (data.descunto_conv !== 0) {
            // console.log('scene 1');
            this.discount = true;
            this.prev = temp - temp * 0.1;
            this.submitRegistoPagamento();
          } else {
            // console.log('scene 2');
            this.prev = temp;
            this.submitWithTotalDesconto(temp);
          }
        },
        error: () => {
          this.discount = false;
          this.submitWithTotalDesconto(temp);
        },
      });
    } else {
      this.userService.getDescontoStatus(this.user.id).subscribe({
        next: (data) => {
          if (data.descunto_conv !== 0) {
            this.discount = true;
            this.prev = temp - temp * 0.1;
            this.submitPrimeiroPagamento();
          } else {
            this.prev = temp;
            this.discount = false;
            this.submitWithTotalDesconto2(temp);
          }
        },
        error: () => {
          this.discount = false;
          this.submitWithTotalDesconto2(temp);
        },
      });
    }
  }

  submitPrimeiroPagamento() {
    let formData = new FormData();
    formData.append('id_aluno', '' + this.user.id);
    formData.append('id_curso', this.curso.id);
    formData.append('imagem', this.file);
    if (this.discount) {
      formData.append('desconto', '' + this.discValue);
    } else {
      formData.append('desconto', '' + this.resto);
    }
    if (this.ownerDisc) {
      formData.append('desconto_conv', '' + this.totalDisc);
    }

    this.subscription.push(
      this.cursosService.primeiropagamentoaluno(formData).subscribe({
        next: (data) => {
          if (this.horario) {
            this.horarioSErvice.gravarHorario(this.horario).subscribe();
          }
          this.toastr.success('Inscrição efectuada com sucesso!');
          this.router.navigate(['/user/meus-cursos']);
        },
        error: (error) => (
          (this.submitted = false),
          this.toastr.error('Ocorreu um erro, contacte a nossa equipe!')
        ),
      })
    );
  }

  submitRegistoPagamento() {
    let formData = new FormData();
    formData.append('nomeCurso', this.curso.nome);
    formData.append('nomealuno', this.user.nome);
    formData.append('emailaluno', this.user.email);
    formData.append('id_aluno', '' + this.user.id);
    formData.append('tipocurso', this.curso.tipocurso);
    formData.append('imagem', this.file);
    if (this.discount) {
      formData.append('desconto', '' + this.discValue);
    } else {
      formData.append('desconto', '' + this.resto);
    }
    if (this.ownerDisc) {
      formData.append('desconto_conv', '' + this.totalDisc);
    }
    formData.append('id_curso', this.curso.id);
    this.cursosService.inscrever(formData).subscribe({
      next: (data) => {
        if (this.horario) {
          this.horarioSErvice.gravarHorario(this.horario).subscribe();
        }
        this.toastr.success('Inscrição efectuada com sucesso!');
        this.router.navigate(['/user/meus-cursos']);
      },
      error: (error) => (
        (this.submitted = false),
        this.toastr.error('Ocorreu um erro, contacte a nossa equipe!')
      ),
    });
  }

  submitWithTotalDesconto(temp) {
    this.userService.getAluno(this.user.id).subscribe({
      next: (data) => {
        if (data.AlunosTotalDesconto) {
          this.totalDisc = data.AlunosTotalDesconto.valor_total;
          this.ownerDisc = true;
          if (temp <= this.totalDisc) {
            this.prev = 0;
            this.resto = this.totalDisc - temp;
            this.discValue = temp;
          } else {
            this.discValue = this.totalDisc;
            this.prev = temp - this.totalDisc;
            this.resto = 0;
          }
        }
        this.submitRegistoPagamento();
      },
      error: () => {
        console.log('WithDiscountError');
        this.submitRegistoPagamento();
      },
    });
  }

  submitWithTotalDesconto2(temp) {
    this.userService.getAluno(this.user.id).subscribe({
      next: (data) => {
        if (data.AlunosTotalDesconto) {
          this.totalDisc = data.AlunosTotalDesconto.valor_total;
          this.ownerDisc = true;
          if (temp <= this.totalDisc) {
            // 1500 - 1000 = 500
            this.prev = 0;
            this.resto = this.totalDisc - temp;
            this.discValue = temp;
          } else {
            this.discValue = this.totalDisc;
            this.prev = temp - this.totalDisc;
            this.resto = 0;
          }
        }
        this.submitPrimeiroPagamento();
      },
      error: () => {
        this.submitPrimeiroPagamento();
      },
    });
  }
}
