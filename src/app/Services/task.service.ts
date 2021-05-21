import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private readonly apiUrl = `${environment.apiUrl}tasks/`;
  constructor(private http: HttpClient) { }

    add(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, data, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

}
