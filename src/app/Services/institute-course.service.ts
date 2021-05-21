import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstituteCourseService {
    private readonly apiUrl = `${environment.apiUrl}instituteCourses/`;
  constructor(private http: HttpClient, private router: Router) { }

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

    delInstituteCourse(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl + id}`).pipe(
            map(result => {
                return result;
            })
        );
    }

    updateCourse(data: any, id: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl + id}`, data, {
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