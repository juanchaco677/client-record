import { PeerServer } from './peer-server';
import { Usuario } from './usuario';
import { PeerClient } from './peer-client';
import * as RecordRTC from 'recordrtc';
export class PeerServerEmisorReceptor {
  public cont = 0;
  constructor(
    public usuario1 ?: Usuario,
    public usuario2 ?: Usuario,
    public peerServer?: PeerServer,
    public peerClient?: PeerClient,
    public stream?: any,
    public recordRTC?: RecordRTC,
    public video?: any

  ) {
  }
}
