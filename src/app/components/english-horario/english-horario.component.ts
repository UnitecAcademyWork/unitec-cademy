import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Horario } from 'src/app/_models/user/horario';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';
import { HorarioService } from 'src/app/_services/horario.service';

@Component({
  selector: 'app-english-horario',
  templateUrl: './english-horario.component.html',
  styleUrls: ['./english-horario.component.scss'],
})
export class EnglishHorarioComponent implements OnInit, OnDestroy {
  h30_start = [
    '06:00',
    '07:00',
    '07:40',
    '08:40',
    '09:20',
    '10:20',
    '11:00',
    '12:00',
    '12:40',
    '13:40',
    '14:20',
    '15:20',
    '16:00',
    '17:00',
    '17:40',
    '18:40',
    '19:30',
  ];
  h30_end = [
    '06:30',
    '07:30',
    '08:10',
    '09:10',
    '09:50',
    '10:50',
    '11:30',
    '12:30',
    '13:10',
    '14:10',
    '14:50',
    '15:50',
    '16:30',
    '17:30',
    '18:10',
    '19:10',
    '20:00',
  ];
  h30 = '06:00';
  h30_check = true;
  start = this.h30_start[0];
  end = this.h30_end[0];
  h30_show = true;
  id = '';
  curso: any;
  horario: Horario = new Horario();
  timetable = '';
  private subscription: Subscription;
  controller = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursosService: CursosService,
    private authenticationService: AuthenticationService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.subscription = this.cursosService.currentCurso.subscribe({
      next: (data) => (this.curso = data),
    });
    if (this.route.snapshot.params['id'] && this.curso) {
      this.id = this.route.snapshot.params['id'];
      if (this.id === 'pratico_II') {
        this.h30_start = [
          '06:00',
          '06:40',
          '07:40',
          '08:20',
          '09:20',
          '10:00',
          '11:00',
          '11:40',
          '12:40',
          '13:20',
          '14:20',
          '15:00',
          '16:00',
          '16:40',
          '17:40',
          '18:20',
          '19:20',
        ];
        this.h30_end = [
          '06:45',
          '07:25',
          '08:25',
          '09:05',
          '10:05',
          '10:45',
          '11:45',
          '12:25',
          '13:25',
          '14:05',
          '15:05',
          '15:45',
          '16:45',
          '17:25',
          '18:25',
          '19:25',
          '20:05',
        ];
        this.start = this.h30_start[0];
        this.end = this.h30_end[0];
        this.h30_check = false;
        this.controller = false;
      }
      this.timetable = this.start + ' - ' + this.end;
    } else {
      this.router.navigate(['/english']);
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onOptionsSelected() {
    let index = this.h30_start.indexOf(this.h30);
    this.start = this.h30_start[index];
    this.end = this.h30_end[index];

    this.timetable = this.start + ' - ' + this.end;

    if (this.controller) {
      if (this.h30_start.indexOf(this.h30) % 2 !== 0) {
        this.h30_check = false;
      } else {
        this.h30_check = true;
      }
    } else {
      if (this.h30_start.indexOf(this.h30) % 2 === 0) {
        this.h30_check = false;
      } else {
        this.h30_check = true;
      }
    }
  }

  signUp() {
    let days_1 = 'Segunda-feira, Quarta-feira, Sexta-feira';
    let days_2 = 'Terça-feira, Quinta-feira, Sábado';

    this.horario.id_curso = this.curso.id;
    this.horario.hora = this.timetable;
    this.horario.nome_curso = this.curso.nome;
    if (!this.h30_check) {
      this.horario.dia = days_1;
    } else {
      this.horario.dia = days_2;
    }
    this.horarioService.changeHorario(this.horario);
    if (this.authenticationService.currentUserValue) {
      this.cursosService.changePayed(false),
        this.router.navigate(['/inscrever']);
    } else {
      this.router.navigate(['/registo']);
    }
  }
}
