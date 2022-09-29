import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Convidados, User, UserConvidados } from 'src/app/_models/user/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-convite',
  templateUrl: './convite.component.html',
  styleUrls: ['./convite.component.scss'],
})
export class ConviteComponent implements AfterViewInit {
  inviteLink = 'https://unitec.ac.mz/registar/?cod=983122';
  code = 0;

  displayedColumns: string[] = ['id', 'email', 'estado', 'bonus'];
  dataSource: MatTableDataSource<Convidados>;
  private user: User = new User();
  userConvidados: UserConvidados = new UserConvidados();
  convidados: Convidados[] = [];
  totalConv = 0;
  totalInscrito = 0;
  showCode = false;
  total_desconto = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(
      this.authenticationService.currentUserValue.token
    );
  }

  ngAfterViewInit() {
    this.userService.getAluno(this.user.id).subscribe((data) => {
      if (data.codigo !== 0) {
        this.showCode = true;
      }

      if(data.AlunosTotalDesconto){
        this.total_desconto = data.AlunosTotalDesconto.valor_total;
      }

      this.convidados = data.AlunosCovidados;
      this.inviteLink = 'https://unitec.ac.mz/registo?cod=' + data.codigo+'&inv='+this.user.id;

      this.convidados.forEach((elem) => {
        if (elem.estado === 'Inscrito') this.totalInscrito++;
        this.totalConv++;
      });
      this.dataSource = new MatTableDataSource(this.convidados);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gerarCodigo() {
    this.userService.gerarCodigo(this.user.id).subscribe((data) => {
      this.showCode = true;
      this.inviteLink = 'https://unitec.ac.mz/registar?cod=' + data.codigo;
    });
  }
}
