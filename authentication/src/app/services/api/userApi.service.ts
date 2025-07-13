import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../type/user.type';
import { environment } from '../../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
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

  updateUser(user: User, id: string|number): Observable<User[]> {
    return this.httpClient.put<User[]>(`${this.apiUrl}/user/${id}`, user).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/user/${id}`).pipe(
      catchError((error: any) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}