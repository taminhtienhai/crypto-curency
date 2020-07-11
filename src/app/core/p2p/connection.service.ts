import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { SessionUtils } from '../../shared/utils/session.util';
import { NotifierService } from 'angular-notifier';
import { errorMessage } from '@shared/error/ErrorMessage';
import { NotifierType } from '@shared/enum/SharedEnum';
import { PeerConnection } from './model/peerconnection.model';
import { DataConnection } from 'peerjs';
import { Account } from '../../data/schema/account.model';
import { FirebaseService } from '../../data/service/firebase.service';
import { Table, AccountDoc, Operator, ConnectStatus } from '../../data/enum/database.info';
import { QueryBuiler } from '../../data/utils/query.util';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  public peer: Peer;
  public lastPeerId: string;
  public peerConnection: PeerConnection[] = [];
  public dataConnectionArray: DataConnection[] = [];

  private MAX_CONNECTION = 5;

  constructor(
    private readonly notifier: NotifierService,
    private readonly fireSer: FirebaseService
  ) { }

  public newPeer(peerId: string): Peer {
    return new Peer(peerId, {
      key: 'peerjs',
      host: 'my-peer-server-0009.herokuapp.com',
      secure: true,
      port: 443,
      config: {
        iceServers: [
          {
            urls: ['turn:173.194.72.127:19305?transport=udp',
              'turn:[2404:6800:4008:C01::7F]:19305?transport=udp',
              'turn:173.194.72.127:443?transport=tcp',
              'turn:[2404:6800:4008:C01::7F]:443?transport=tcp'
            ],
            username: 'CKjCuLwFEgahxNRjuTAYzc/s6OMT',
            credential: 'u1SQDR/SQsPQIxXNWQT7czc/G4c='
          },
          { urls: ['stun:stun.l.google.com:19302'] }
        ]
      }
    });
  }

  public async startConnection(): Promise<Peer> {
    const { peerId } = SessionUtils.getUser();
    if (!peerId) { throw new Error(errorMessage.NOT_EXIST); }
    if (!this.peer) {
      this.peer = this.newPeer(peerId);
    }
    this.manageConnection();
    this.manageConnectionError();
    return this.peer;
  }

  /**
   * Handle error
   * * Should implement more function
   */
  public manageConnectionError(): void {
    this.peer.on('disconnected', () => {
      console.log(errorMessage.DISCONNECTED);
      this.notifier.notify(NotifierType.WARNING, errorMessage.DISCONNECTED);
      this.peer.id = this.lastPeerId;
      this.peer.reconnect();
    });
    this.peer.on('error', (error) => {
      console.log(error);
      this.notifier.notify(NotifierType.ERROR, error);
    });
  }

  public isConnectPeer(): number {
    return this.peerConnection.length > 0 ? this.peerConnection.length : -1;
  }

  /**
   * Initialize for connection
   */
  public manageConnection(): void {
    // When your connection begin success
    this.peer.on('open', (id: string) => {
      console.log(`My connection id is ${id}`);
    });
    // When a peer connect to you
    this.peer.on('connection', (connection: DataConnection) => {
      this.manageOtherConnection(connection);
    });
  }

  public manageOtherConnection(connection: DataConnection): DataConnection {
    connection.on('open', () => {
      console.log('New peer discovery');
      console.log(connection.peer);
      connection.send(`Peer ${this.peer.id} say hello`);
      // Receive data from peer
      connection.on('data', (data) => {
        console.log(data);
        // Todo: Mode blockchain update
        // Todo: Mode transactions update
      });
      // When that peer disconnect
      connection.on('close', () => {
        // Todo: Delete that peer from manage list
        this.removePeerDisconnected(connection);
      });
      // When geting error
      connection.on('error', (error) => {
        console.error(error);
        this.notifier.notify(NotifierType.ERROR, error);
        this.removePeerDisconnected(connection);
      });
      const newConnection = new PeerConnection(connection);
      this.peerConnection.push(newConnection);
    });
    return connection;
  }

  /**
   * Remove manage Peer has been disconnected.
   */
  public removePeerDisconnected(connection: any): void {
    this.peerConnection = this.peerConnection.filter(it => it.Id !== connection.peer);
  }

  /**
   * Send data to all peer being connected.
   * @param data Data want to send.
   */
  public async broadCastAll(data: any) {
    if (!this.peer) {
      await this.startConnection();
    }
    for (const conn of this.dataConnectionArray) {
      console.log(`Peer to broadcast is ${conn.peer}`);
      conn.on('open', () => { conn.send(data); });
    }
  }

  public connectTo(peerId: string): DataConnection {
    const dataConnection: DataConnection = this.peer.connect(peerId);
    return this.manageOtherConnection(dataConnection);
  }

  /**
   * Choose some random peer to connect
   */
  public async connectRandomOnlinePeer(): Promise<void> {
    // Todo: Get online peer on firebase.
    let count = 1;
    // Fetch all online peer
    let accounts: Account[] = await this.findOnlinePeer();
    const user = SessionUtils.getUser();
    // If no one online, return error
    if (accounts.length === 0) { throw new Error(errorMessage.NO_ONE_AVAILABLE); }
    console.log(accounts);
    while (count <= this.MAX_CONNECTION || accounts.length > 0) {
      // Connect random peer
      const random: number = Math.floor(Math.random() * accounts.length);
      console.log(random);
      if (accounts.length === 0) { break; }
      const { peerId, id } = accounts[random] as Account;
      if (!peerId || peerId === user.peerId) {
        accounts = accounts.filter(it => it.id !== id);
        continue;
      }
      this.dataConnectionArray.push(this.connectTo(peerId));
      accounts = accounts.filter(it => it.id !== id);
      count++;
    }
  }

  /**
   * Find all online peer at the moment.
   */
  public async findOnlinePeer(): Promise<Account[]> {
    try {
      const { success, error, data } = await this.fireSer.readItem(Table.ACCOUNT, [
        QueryBuiler.createCondition(AccountDoc.STATUS, Operator.EQUAL, ConnectStatus.ONLINE)
      ]);
      if (!success) { throw new Error(error); }
      return data;
    } catch (err) {
      console.log(err);
    }
    return [];
  }
}
