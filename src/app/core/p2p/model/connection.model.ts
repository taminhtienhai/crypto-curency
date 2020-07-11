export interface PeerData {
  id: string;
  data: any;
}

export interface PersonalInfo {
  userName: string;
  connectionId: string;
}

export interface SignalInfo {
  user: string;
  signal: any;
}

export interface ChatMessage {
  own: boolean;
  message: string;
}
