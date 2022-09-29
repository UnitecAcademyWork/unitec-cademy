import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Agenda } from 'src/app/_models/user/agenda';
import { User } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent implements OnInit {
  totalConf: number = 0;
  totalProc: number = 0;
  total: number = 0;

  displayedColumns: string[] = ['id', 'curso', 'estado', 'horario'];
  dataSource: MatTableDataSource<Agenda>;
  private user: User = new User();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cursoService: CursosService,
    private authenticationService: AuthenticationService
  ) {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(
      this.authenticationService.currentUserValue.token
    );
  }

  ngOnInit(): void {
    this.cursoService.listaduvida(this.user.id).subscribe({
      next: (data) => {
        data.forEach((elem) => {
          this.total++;
          if (elem.estado === 'confirmado') {
            this.totalConf++;
          } else {
            this.totalProc++;
          }
        });
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }
}
