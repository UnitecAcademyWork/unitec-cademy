import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  constructor(private http: HttpClient) {}

  sendMail(contacto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/enviaremailparanos`, contacto);
  }

  sendBusiness(business): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/receberemailbusiness`,
      business
    );
  }

  help(contact: string, message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/enviarcontacto`, {
      contact,
      message,
    });
  }

  exemplo(): Observable<any> {
    return this.http.get(`http://192.168.100.2:5000/allpublishdata`);
  }
}
