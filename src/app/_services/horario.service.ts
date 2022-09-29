import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Horario } from '../_models/user/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private horario = new BehaviorSubject(null);
  currentHorario = this.horario.asObservable();

  constructor(private http: HttpClient) { }

  gravarHorario(horario: Horario) {
    return this.http.post(`${environment.apiUrl}/gravarhorario`, horario);
  }

  changeHorario(horario: Horario){
    this.horario.next(horario);
  }
}
