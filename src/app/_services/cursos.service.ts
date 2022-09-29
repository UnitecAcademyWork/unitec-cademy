import { Programa } from './../_models/programa';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from './../_models/user/curso';
import { Agenda } from '../_models/user/agenda';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private curso = new BehaviorSubject(null);
  currentCurso = this.curso.asObservable();

  private payed = new BehaviorSubject(false);
  currentPayed = this.payed.asObservable();

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http
      .get<Curso[]>(`${environment.apiUrl}/vercursos`)
      .pipe(
        map((events) =>
          events.sort(
            (a: any, b: any) =>
              new Date(a.Imagens[0].createdAt).getTime() -
              new Date(b.Imagens[0].createdAt).getTime()
          )
        )
      );
  }

  getNovosCursos(): Observable<Curso[]> {
    return this.http
      .get<Curso[]>(`${environment.apiUrl}/vercursos`)
      .pipe(
        map((events) =>
          events.sort(
            (a: any, b: any) =>
              new Date(b.Imagens[0].createdAt).getTime() -
              new Date(a.Imagens[0].createdAt).getTime()
          )
        )
      );
  }

  getCurso(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${environment.apiUrl}/bucarcursoid/${id}`);
  }

  getCursoPrograma(id: number): Observable<Programa[]> {
    return this.http.get<Programa[]>(
      `${environment.apiUrl}/mostrarCursoProgramas/${id}`
    );
  }

  getAlunoCurso(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/cursoregistado/${id}`);
  }

  pesquisarCursos(nome: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(
      `${environment.apiUrl}/pesquisartodos?pesquisar=${nome}`
    );
  }

  inscrever(curso: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/registarpagamento`, curso);
  }

  voto(id: number, email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/votos/${id}/${email}`);
  }

  getVotos(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/buscarvotos/${id}`);
  }

  getCursoCategoria(categoria: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/filtrarcategorias/${categoria}`
    );
  }

  mostarCursoRequisitos(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mostarCursoRequisitos/${id}`);
  }

  verificarprimeiropagmento(
    id_aluno: number,
    id_curso: number
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/verificarprimeiropagmento/${id_aluno}/${id_curso}`
    );
  }

  primeiropagamentoaluno(dados): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/primeiropagamentoaluno`,
      dados
    );
  }

  applyDesconto(email_aluno_conv) {
    let id_convidado = 2217;
    return this.http.post(`${environment.apiUrl}/gerardescontoaluno`, {
      email_aluno_conv,
      id_convidado,
    });
  }

  // getRequisitos(id: number): Observable<any>{
  //   return this.http.get(`${environment.apiUrl}/`);
  // }

  marcarAula(formData) {
    return this.http.post(`${environment.apiUrl}/duvidas`, formData);
  }

  listaduvida(id: number): Observable<Agenda[]> {
    return this.http.get<any>(`${environment.apiUrl}/listaduvida/${id}`).pipe(
      map((data) => {
        let agenda: Agenda[] = [];
        data.forEach((elem) => {
          agenda.push({
            nome: elem.Curso.nome,
            estado: elem.estado,
            horario: elem.horario,
          });
        });
        return agenda;
      })
    );
  }

  changeCurso(curso: Curso) {
    this.curso.next(curso);
  }

  changePayed(payed: boolean) {
    this.payed.next(payed);
  }
}
