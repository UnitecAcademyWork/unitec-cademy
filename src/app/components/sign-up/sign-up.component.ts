import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserService } from './../../_services/user.service';
import { Curso } from 'src/app/_models/user/curso';
import { CursosService } from 'src/app/_services/cursos.service';
import { Subscription } from 'rxjs';
import { HorarioService } from 'src/app/_services/horario.service';
import { Horario } from 'src/app/_models/user/horario';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  user: any = new Object();
  curso: Curso;
  subscription: Subscription[] = [];
  loading = false;
  errors = [];
  horario: Horario = new Horario();
  id = 0;
  showInvite = false;
  phone = '((82)[0-9 ]{7})|((84)[0-9 ]{7})|((83)[0-9 ]{7})|((85)[0-9 ]{7})|((86)[0-9 ]{7})|((87)[0-9 ]{7})';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cursosService: CursosService,
    private toastr: ToastrService,
    private horarioService: HorarioService
  ) {
  }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      apelido: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      invite: '',
      contacto: ['', Validators.required],
    });

    if (this.route.snapshot.queryParams['cod'] && this.route.snapshot.queryParams['inv']) {
      this.showInvite = true;
      this.f.invite.setValue(this.route.snapshot.queryParams['cod'])
      this.id = this.route.snapshot.queryParams['inv'];
      this.f.invite.disable();
    }
    this.subscription.push(this.horarioService.currentHorario.subscribe({ next: (data) => this.horario = data }))
  }

  ngOnDestroy(): void {
    this.cursosService.changeCurso(null);
    this.horarioService.changeHorario(null);
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

  get f() {
    return this.registerForm.controls;
  }

  onRegister(event: Event): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.user.nome = this.f.nome.value;
      this.user.apelido = this.f.apelido.value;
      this.user.email = this.f.email.value;
      this.user.contacto = this.f.contacto.value;

      this.subscription.push(this.cursosService.currentCurso.subscribe((data) => {
        this.curso = data;
        if (this.curso !== null) {
          this.user.nomeCurso = this.curso.nome;
          this.user.tipocurso = this.curso.tipocurso;
          this.user.duracao = this.curso.duracao;
          this.user.id_curso = this.curso.id;
          this.subscription.push(this.userService.gravarUserCurso(this.user).subscribe({
            next: (data) => {
              this.user = data;
              if (this.showInvite) {
                this.userService.gravarDesconto(this.f.invite.value, this.id, this.user.email).subscribe();
              }
              this.toastr.success(
                'Conta criada com sucesso, por favor verifique o seu email ou telemóvel!'
              );
              if (this.horario) {
                this.horario.id_aluno = this.user.id;
                this.horarioService.gravarHorario(this.horario).subscribe()
              }
              this.router.navigate(['/login'])
            },
            error: (error) => {
              this.errors = error.errors;
              // this.toastr.error(error);
            },
          }));
        } else {
          this.subscription.push(this.userService
            .gravarUser(this.user)
            .pipe(first())
            .subscribe({
              next: () => {
                if (this.showInvite) {
                  this.userService.gravarDesconto(this.f.invite.value, this.id, this.user.email).subscribe();
                }
                this.toastr.success(
                  'Conta criada com sucesso, por favor verifique o seu email ou telemóvel!'
                ),
                  this.router.navigate(['/login'])
              },
              error: (error) => {
                this.errors = error.errors;
                // this.toastr.error(error);
                this.loading = false;
              },
            }));
        }
      }));
    }
  }
}
