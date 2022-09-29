import { Curso } from './../../../_models/user/curso';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Programa } from 'src/app/_models/programa';
import { User } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';
import { GoogleAnalyticsService } from 'src/app/_services/google-analytics.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent implements OnInit, OnDestroy {
  enumList = [
    'Requisitos do Curso',
    'Objectivo',
    'Avaliações',
    'Material',
    'Como funciona',
  ];
  selected: any;
  curso: any;
  cursos: any[];
  loading: boolean = true;
  loading2: boolean = true;
  programas: Programa[];
  private subscription: Subscription[] = [];
  requisitos: any;
  str: string = '';
  previews: string;
  prev: number;
  req = 'Video';
  user: User = new User();
  discount = false;
  ownerDisc = false;
  totalDisc = 0;
  resto = 0;
  isLogged = false;
  private id: number;

  constructor(
    private cursosService: CursosService,
    private route: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.selected = this.enumList[0];
    this.id = this.route.snapshot.params['id'];

    const helper = new JwtHelperService();
    if (this.authenticationService.currentUserValue) {
      this.user = helper.decodeToken(
        this.authenticationService.currentUserValue.token
      );
      this.isLogged = true;
    }

    this.subscription.push(
      this.route.paramMap
        .pipe(
          map((params) => params.get('id')),
          tap((id) => (this.id = +id))
        )
        .subscribe((id) => {
          this.loading = true;
          this.getCurso();
          window.scroll(0, 0);
        })
    );

    this.getCursos();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  getrequisitos() {
    this.subscription.push(
      this.cursosService.mostarCursoRequisitos(this.curso.id).subscribe({
        next: (data) => (this.requisitos = data),
        error: () =>
          this.toastr.error('Ocorreu um erro ao listar os requisitos'),
      })
    );
  }

  getCurso(): void {
    let er = /\.|\,/gi;
    let re = /\?/gi;
    this.subscription.push(
      this.cursosService.getCurso(this.id).subscribe({
        next: (data) => {
          this.curso = data;
          let temp = +this.curso.valor.replace(er, '');
          if (!this.isLogged) {
            this.prev = temp;
          } else {
            this.userService.getAluno(this.user.id).subscribe((data) => {
              if (data.AlunosTotalDesconto) {
                this.totalDisc = data.AlunosTotalDesconto.valor_total;
                this.prev = temp - this.totalDisc;
                if (data.AlunosTotalDesconto.valor_total !== 0) {
                  this.ownerDisc = true;
                  if (temp < this.totalDisc) {
                    this.prev = 0;
                    this.resto = temp - this.totalDisc;
                  } else {
                    this.prev = temp - this.totalDisc;
                    this.resto = this.totalDisc - temp;
                  }
                }
              }
            });
            this.userService.getDescontoStatus(this.user.id).subscribe({
              next: (data) => {
                if (data.descunto_conv !== 0) {
                  this.discount = true;
                  this.prev = temp - temp * 0.1;
                } else {
                  this.prev = temp;
                }
              },
              error: () => {
                this.discount = false;
              },
            });
          }
          // this.prev = +this.curso.valor.replace(er, '.');
          // this.prev =  (this.prev * 0.1);
          // this.prev = Math.round(this.prev * 100);
          // this.prev = temp - this.prev;
          // this.previews = '' + this.prev;
          // this.previews = this.previews.replace(/\./gi, ',');
          this.curso.descricao = this.curso.descricao.replace(re, '<br>');
          this.getPrograma();
          this.getrequisitos();
          if (this.curso.tipocurso === 'presencial') {
            this.enumList.pop();
            this.req = 'Manual';
          }
        },
        error: () =>
          this.toastr.error('Ocorreu um erro, por favor tente mais tarde!'),
        complete: () => (this.loading = false),
      })
    );
  }

  emitEvent(curso: Curso) {
    this.googleAnalyticsService.eventEmitter(
      'click',
      curso.nome,
      curso.tipocurso,
      'click'
    );
  }

  getCursos(): void {
    this.subscription.push(
      this.cursosService.getCursos().subscribe({
        next: (data) => {
          this.cursos = data.slice(0, 3);
          this.cursos.forEach((item) => {
            const novo = {
              votos: 0,
            };
            Object.assign(item, novo);
            this.cursosService.getVotos(item.id).subscribe((data) => {
              item.votos = data;
            });
          });
        },
        error: () =>
          this.toastr.error('Ocorreu um erro, por favor tente mais tarde!'),
        complete: () => (this.loading2 = false),
      })
    );
  }

  getPrograma(): void {
    this.subscription.push(
      this.cursosService.getCursoPrograma(this.id).subscribe((data) => {
        this.programas = data;
      })
    );
  }

  onSelectList(item: any) {
    this.selected = item;
  }

  matricular(curso): void {
    this.cursosService.changeCurso(curso);
    if (this.authenticationService.currentUserValue) {
      this.cursosService.changePayed(false),
        this.router.navigate(['/inscrever']);
    } else {
      this.router.navigate(['/registo']);
    }
  }
}
