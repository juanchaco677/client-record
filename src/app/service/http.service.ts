import { Util } from './../util';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Injectable()
export class HttpService {
  constructor(public http: HttpClient) {}

  store(data: any, url: string): Observable<any> {
    const httpOptionsPost = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    return this.http
      .post<any>(Util.apiUrl + url + '/store', data, httpOptionsPost)
      .pipe(
        tap(success => console.log('crear objeto')),
      );
  }
}
