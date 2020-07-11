import { DataConnection } from 'peerjs';

export class PeerConnection {

  private connection: DataConnection;

  private id: string;
  private date: number;
  private data: any[] = [];

  /**
   * Handle Connection Information.
   * @param id connection Id
   */
  constructor(conn: DataConnection) {
    this.connection = conn;
    this.id = conn.peer;
    this.date = Date.now();
  }

  get Id(): string { return this.id; }
  get Date(): number { return this.date; }
  get Connection(): DataConnection { return this.connection; }

  listenData(input: any) {
    console.log('listenData: START');
    this.data.push(input);
    console.log(input);
    console.log('listenData: END');
  }

}
