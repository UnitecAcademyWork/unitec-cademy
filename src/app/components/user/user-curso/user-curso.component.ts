import { GoogleAnalyticsService } from './../../../_services/google-analytics.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';
import { Curso } from 'src/app/_models/user/curso';

@Component({
  selector: 'app-user-curso',
  templateUrl: './user-curso.component.html',
  styleUrls: ['./user-curso.component.scss'],
})
export class UserCursoComponent implements OnInit, OnDestroy {
  cursos: any[];
  temp_curso: any;
  loading: boolean = true;
  user: any;
  tempId = -1;
  private subscription: Subscription[] = [];

  constructor(
    private cursosService: CursosService,
    private auth: AuthenticationService,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(this.auth.currentUserValue.token);
    this.subscription.push(this.cursosService.getAlunoCurso(this.user.id).subscribe({
      next: (data) => {
        this.cursos = data;
        this.cursos.forEach((item) => {
          this.subscription.push(this.cursosService
            .verificarprimeiropagmento(this.user.id, item.id_curso)
            .subscribe({
              next: (data) => { },
              error: (error) => {
                this.subscription.push(this.cursosService
                  .getCurso(item.id_curso)
                  .subscribe({
                    next: (data) => (
                      this.cursosService.changeCurso(data),
                      this.cursosService.changePayed(true),
                      this.router.navigate(['/inscrever'])
                    )
                  }));
              }
            }));
          const novo = {
            Imagens: [{ url: '' }],
          };
          Object.assign(item, novo);
          this.subscription.push(this.cursosService.getCurso(item.id_curso).subscribe({
            next: (data) => {
              this.temp_curso = data;
              item.Imagens[0].url = this.temp_curso.Imagens[0].url;
            }
          }));
        });
        this.loading = false;
      },
      error: () => (this.loading = false)
    }));
  }

  ngOnDestroy() {
    this.subscription.forEach(subscription => subscription.unsubscribe())
  }

  vote(idCurso: number) {
    this.subscription.push(this.cursosService.voto(idCurso, this.user.email)
      .subscribe({ next: (data) => (this.tempId = idCurso) }));
  }

  emitEvent(curso: Curso) {
    this.googleAnalyticsService.eventEmitter("click", curso.nome, curso.tipocurso, 'click')
  }
}
