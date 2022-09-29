import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload();
        }

        const error = err.error.errors || err.statusText;
        return throwError(() => err.error);
      })
    );
  }
}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     return next.handle(request).pipe(
//       retry(1),
//       catchError((error: HttpErrorResponse) => {
//         let errorMessage = '';
//         if (error.status === 401) {
//           // auto logout if 401 response returned from api
//           this.authenticationService.logout();
//           location.reload();
//         }
//         if (error.error instanceof ErrorEvent) {
//           errorMessage = `Error: ${error.error.message}`;
//         } else {
//           errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
//         }
//         // console.log(errorMessage);
//         return throwError(() => errorMessage);
//         // return throwError(errorMessage)
//       })
//     );
//   }
// }

// The Error Interceptor intercepts http responses from the api to check if
// there were any errors. If there is a 401 Unauthorized response the user is
// automatically logged out of the application, all other errors are re-thrown
// up to the calling service so an alert with the error can be displayed on the screen

// It's implemented using the HttpInterceptor class included in the HttpClientModule,
// by extending the HttpInterceptor class you can create a custom interceptor to catch
// all error responses from the server in a single location.

// Http interceptors are added to the request pipeline in the providers section of the app.module.ts file.
