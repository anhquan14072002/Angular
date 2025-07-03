import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../enum/user.type';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/user`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

createUser(user: User): Observable<User[]> {
  return this.httpClient.post<User[]>(`${this.apiUrl}/user`, user).pipe(
    catchError((error: any) => {
      console.error(error);
      return throwError(() => error);
    })
  );
}
}