import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SocketService {
  $recibeRecord = this.socket.fromEvent<any>('recibeRecord');
  $stopRecord = this.socket.fromEvent<any>('stopRecord');
  $createAnswer = this.socket.fromEvent<any>('createAnswer');
  listenRecord$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  constructor(private socket: Socket) {

  }
  emit(key: string, data: any) {
    this.socket.emit(key, data);
  }

  addListenRecord(data: boolean) {
    this.listenRecord$.next(data);
  }

  getListenRecord() {
    return this.listenRecord$.asObservable();
  }

  deleteListenRecord() {
    this.listenRecord$.next(null);
  }

}
