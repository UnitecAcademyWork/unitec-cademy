import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  fileName = '';
  user: User;
  cursos: Disciplinas[] = [];
  formData: FormData;
  curso: Disciplinas;
  horas = '10:30';
  file: File;
  plataforma = 'teams';
  duvida = '';

  constructor(
    private authenticationService: AuthenticationService,
    private cursosService: CursosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(
      this.authenticationService.currentUserValue.token
    );
    this.cursosService.getAlunoCurso(this.user.id).subscribe({
      next: (data) => {
        data.forEach((curso) => {
          if (curso.estado == 'confirmado') {
            this.cursos.push({
              idDisciplina: curso.id_curso,
              disciplina: curso.nomecurso,
            });
          }
        });
      },
      complete: () => {
        if (this.cursos.length > 0) {
          this.curso = this.cursos[0];
        }
      },
    });
  }

  onSelect(event) {
    this.cursos.forEach((curso) => {
      if (curso.disciplina === event.target.value) {
        this.curso = curso;
      }
    });
    // console.log(this.curso);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.fileName = this.file.name;
    }
  }

  onSubmit() {
    if (this.curso === undefined) {
      this.toastr.info('Escolha disciplina', 'Aviso');
      return;
    }
    if (!this.horas) {
      this.toastr.info('Escolha horario', 'Aviso');
      return;
    }
    if (!this.file) {
      this.toastr.info('Adicione o pagamento', 'Aviso');
      return;
    }
    if (!this.duvida) {
      this.toastr.info('Descreva a sua duvida', 'Aviso');
      return;
    }
    this.formData = new FormData();
    // this.formData.append('disciplina', this.curso.disciplina);
    this.formData.append('idDisciplina', this.curso.idDisciplina + '');
    this.formData.append('horario', this.horas);
    this.formData.append('duvidas', this.duvida);
    this.formData.append('idAluno', this.user.id + '');
    this.formData.append('pagamento', this.file);

    this.cursosService.marcarAula(this.formData).subscribe({
      next: (data) =>
        this.toastr.success('Aula agendada com sucesso', 'Sucesso!'),
      error: () =>
        this.toastr.error('ocorreu um erro, tente novamente!', 'Error'),
    });
  }
}

interface Disciplinas {
  idDisciplina: number;
  disciplina: string;
}
