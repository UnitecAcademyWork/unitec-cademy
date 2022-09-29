import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Comentario } from './../_models/user/coment';

@Injectable({
  providedIn: 'root',
})
export class ComentService {
  constructor(private http: HttpClient) {}

  getComentario(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(
      `${environment.apiUrl}/listarcomentario`
    );
  }
}
