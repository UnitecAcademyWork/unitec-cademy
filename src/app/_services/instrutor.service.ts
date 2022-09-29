import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Instrutor } from '../_models/user/instrutor';

@Injectable({
  providedIn: 'root'
})
export class InstrutorService {

  private instrutor = new BehaviorSubject(null);
  currentInstrutor = this.instrutor.asObservable();

  constructor(private http: HttpClient) { }

  dadosPessoais(dados): Observable<any> {
    return this.http.post(`${environment.apiUrl}/registarInstrutor`, dados);
  }

  dadosCurso(dados: Instrutor): Observable<any> {
    return this.http.post(`${environment.apiUrl}/registarcursoinstrutor`, dados);
  }

  changeInstrutor(instrutor: Instrutor){
    this.instrutor.next(instrutor);
  }
}
