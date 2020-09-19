import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';



export class Util {

  static apiUrl = 'http://181.55.192.137:8000/api/';
  constructor() {}

  static empty(data: any) {
    return (
      data === undefined ||
      data === null ||
      data === '' ||
      data === ' ' ||
      data === 0
    );
  }
  static emptyNaN(data: any) {
    return (
      data === undefined ||
      isNaN(+data) ||
      data === null ||
      data === '' ||
      data === ' ' ||
      data === 0
    );
  }

  static esMultiplo(numero: number, multiplo: number) {
    const resto = numero % multiplo;
    return resto === 0;
  }

  static getHttpOptionsPost() {
    const httpOptionsPost = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    return httpOptionsPost;
  }
}
