import { HttpService } from './service/http.service';
import { ArchivoBiblioteca } from './archivo-biblioteca';
import { PeerServerEmisorReceptor } from './peer-server-emisor-receptor';
import { PeerClient } from './peer-client';
import { PeerServer } from './peer-server';
import { Usuario } from './usuario';
import { Util } from './util';
import { SocketService } from './service/socket.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { utils } from 'protractor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'clientRecord';
  usuario: Usuario;
  rooms = {};
  recordRTC: any;
  cont = 0;
  @ViewChild('videoElement') video: ElementRef;
  constructor(private socket: SocketService, private httpService: HttpService) {
    this.usuario = new Usuario();
    this.usuario.id = 0;
    this.usuario.rol = { tipo: 'RE' };
    this.socket.emit('livingRoom', { usuario: this.usuario });
  }
  ngOnInit(): void {
    this.socket.$recibeRecord.subscribe((data: any) => this.listenRecord(data));

    this.socket.$createAnswer.subscribe(async (data: any) =>
      this.createAnswer(data)
    );

    this.socket.$stopRecord.subscribe(async (data: any) => this.parar(data));
  }

  listenRecord(data: any) {
    if (!Util.empty(data)) {
    }
  }

  async createAnswer(data: any) {
    if (!Util.empty(data.data)) {
      if (Util.empty(this.rooms[data.id])) {
        this.rooms[data.id] = new PeerServerEmisorReceptor(
          data.usuario1,
          data.usuario2,
          new PeerServer(),
          new PeerClient()
        );
      }
      this.rooms[data.id].peerClient.createDataChannel('clientRecord');
      this.socket.getListenRecord().subscribe((objeto) => {
        if (!Util.empty(objeto) && objeto) {
          this.listenPeer(data);
        }
      });

      if (data.data.type === 'offer') {
        console.log('1');
        this.socket.addListenRecord(true);
        await this.rooms[data.id].peerClient.createAnswer(data.data);
        this.socket.addListenRecord(true);
        this.socket.emit('sendAnswer', {
          data: this.rooms[data.id].peerClient.localDescription,
          id: data.id,
          camDesktop: data.camDesktop,
          usuarioOrigen: data.usuarioDestino,
          usuarioDestino: data.usuarioOrigen,
          record: data.record,
          biblioteca: data.biblioteca
        });
      } else {
        if (data.data.candidate) {
          await this.rooms[data.id].peerClient.peerConnection.addIceCandidate(
            data.data
          );
        }
      }
    }
  }

  listenPeer(data: any) {
    if (!Util.empty(data) && data && !Util.empty(this.rooms[data.id])) {
      this.rooms[data.id].peerClient.peerConnection.ontrack = (event: any) =>
        this.getRemoteStream(event, data);

      this.rooms[data.id].peerClient.peerConnection.onicecandidate = (
        event: any
      ) => this.getIceCandidate(event, data);

      // this.rooms[data.id].dataChannel.onopen = (event: any) =>
      //   this.getOnOpenDataChannel(event, false);
      this.rooms[data.id].peerClient.dataChannel.onerror = () => {};

      this.rooms[data.id].peerClient.dataChannel.onopen = () => {
        // this.rooms[data.id].send(JSON.stringify(this.videoBoton));
      };

      this.rooms[data.id].peerClient.dataChannel.onclose = () => {};

      this.rooms[data.id].peerClient.peerConnection.ondatachannel = (
        event: any
      ) => this.getOnDataChannel(event, data);
    }
  }

  getRemoteStream(ev: any, data: any) {
    if (ev.streams && ev.streams.length > 0) {
      for (const element of ev.streams) {
        this.rooms[data.id].stream = element;
      }
    } else {
      const inboundStream = new MediaStream(ev.track);
      this.rooms[data.id].stream = inboundStream;
    }
    if (!Util.empty(this.rooms[data.id].stream)) {
      this.rooms[data.id].video = document.createElement('video');
      this.rooms[data.id].video.srcObject = this.rooms[data.id].stream;
      this.rooms[data.id].video.play();
      this.grabar(data);
    }
  }

  getOnDataChannel(event: any, data: any) {
    this.rooms[data.id].receiveChannel = event.channel;
    this.rooms[data.id].receiveChannel.onmessage = (e: any) => {
      console.log('escuchando data channel');
    };
  }

  getIceCandidate(event: any, data: any) {
    if (event.candidate) {
      this.socket.emit('sendAnswer', {
        data: event.candidate,
        id: data.id,
        camDesktop: true,
        usuarioOrigen: data.usuarioDestino,
        usuarioDestino: data.usuarioOrigen,
        record: data.record,
        biblioteca: data.biblioteca
      });
    }
  }

  grabar(data: any) {
    const options = {
      mimeType: 'video/mp4',
      // only for audio track
      audioBitsPerSecond: 128000,

      // only for video track
      videoBitsPerSecond: 128000,
    };
    this.rooms[data.id].recordRTC = RecordRTC(
      this.rooms[data.id].stream,
      options
    );
    this.rooms[data.id].recordRTC.startRecording();
  }

  async parar(data: any) {
    console.log(this.rooms[data.id]);
    await this.rooms[data.id].recordRTC.stopRecording(() => {
      this.guardar(data);
    });
  }

  guardar(data: any) {
    console.log('guardando data');
    console.log(data);
    let biblioteca = new ArchivoBiblioteca();
    const date = new Date();
    biblioteca.nombre =
      'clase-' +
      data.id +
      '-' +
      date.getFullYear() +
      '-' +
      date.getHours() +
      '-' +
      date.getMinutes() +
      '-' +
      date.getSeconds() +
      '.mp4';
    biblioteca.extension = 'mp4';
    biblioteca.tipo = 'CLASE';
    biblioteca.id_programacion_horario = data.biblioteca.id_programacion_horario;
    biblioteca.id_salon = data.biblioteca.id_salon ;
    biblioteca.id_usuario = data.biblioteca.id_usuario;

    this.rooms[data.id].recordRTC.save(biblioteca.nombre);
    this.rooms[data.id].peerClient.close();
    this.rooms[data.id].recordRTC.destroy();
    this.rooms[data.id].recordRTC = null;
    this.rooms[data.id].stream
      .getAudioTracks()
      .forEach((track) => track.stop());
    this.rooms[data.id].stream
      .getVideoTracks()
      .forEach((track) => track.stop());
    delete this.rooms[data.id];

    this.httpService
      .store({ biblioteca }, 'archivo-biblioteca')
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe((data: any) => {
        if (!Util.empty(data) && data.success) {
          biblioteca = data.biblioteca;
        }
      });
    this.socket.emit('archivosBibliotecaS', { id: data.id, biblioteca });
  }
}
