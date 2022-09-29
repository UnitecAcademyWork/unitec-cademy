import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './../_models/user/user';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private currentUser: Observable<User>;
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  login(email: string, senha: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/loginaluno`, {
        email,
        senha,
      })
      .pipe(
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }
}

// The authentication service is used to login & logout of the Angular app, it notifies other
// components when the user logs in & out, and allows access the currently logged in user.

// Angular components can subscribe() to the public currentUser: Observable property to
// be notified of changes, and notifications are sent when the this.currentUserSubject.next()
// ethod is called in the login() and logout() methods, passing the argument to each subscriber.

// The constructor() of the service initialises the currentUserSubject with the currentUser
// object from localStorage which enables the user to stay logged in between page refreshes
// or after the browser is closed. The public currentUser property is then set
// to this.currentUserSubject.asObservable(); which allows other components to subscribe
// to the currentUser Observable but doesn't allow them to publish to the currentUserSubject,
// this is so logging in and out of the app can only be done via the authentication service.

// The currentUserValue getter allows other components an easy way to get the value of the
// currently logged in user without having to subscribe to the currentUser Observable.

// The logout() method removes the current user object from local storage and publishes null
// to the currentUserSubject to notify all subscribers that the user has logged out.
