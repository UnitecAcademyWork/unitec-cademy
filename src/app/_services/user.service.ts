import { environment } from './../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserConvidados } from '../_models/user/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private className = new BehaviorSubject('');
  currentClassName = this.className.asObservable();

  private temp = new BehaviorSubject('');
  currentTemp = this.temp.asObservable();

  constructor(private http: HttpClient) {}

  getAluno(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/aluno/${id}`);
  }

  gravarUser(user: User) {
    return this.http.post(`${environment.apiUrl}/registaraluno`, user);
  }

  gravarUserInfo(aluno: any): Observable<Object> {
    return this.http.put(`${environment.apiUrl}/editaraluno`, aluno);
  }

  gravarNewInfo(aluno: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/registocompletodados`, aluno)
  }

  gravarUserCurso(dados: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/inscrevercaoaluno`, dados);
  }

  getUserInfo(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/bucardadoconfimacao/${id}`);
  }

  mudarSenha(senha: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/mudarsenhaaluno`, senha);
  }

  userFoto(formData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/editaralunofotoperfil`, formData);
  }

  userNewFoto(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/alunofoto`, formData);
  }

  getAlunoFoto(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/alunofotobuscar/${id}`);
  }

  recuverMail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/recuperacaosenha`, {email});
  }

  alterarSenha(novaSenha, token): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `bearer ${token}`);
    return this.http.put(`${environment.apiUrl}/alterarsenha`, novaSenha, {headers: headers})
  }

  gerarCodigo(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/editarcodigo`, {id})
  }

  gravarDesconto(codigo: number, id: number, email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/registarAlunoDescunto/${codigo}/${id}/${email}`,)
  }

  getDescontoStatus(id: number):Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/dadosdesconto/${id}`)
  }

  changeClass(className: string) {
    this.className.next(className);
  }

  setTemp(value: string) {
    this.temp.next(value);
  }
}
