export interface MarkerType {
  id: number;
  name: string;
  gpsx: number;
  gpsy: number;
  status: number;
  zona: string;
  statusLabel: string;
  log: string;
  voltage: number;
  temp: number;
}

export interface MarkerHistory {
  id: string;
  description: string;
  time: Date;
  username: string;
  type: string;
}
