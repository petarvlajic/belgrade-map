export interface MarkerType {
  id: number;
  gpsx: number;
  gpsy: number;
  zona: string;
  status: number;
  name: string;
  statusLabel: string;
}

export interface MarkerHistory {
  description: string;
  time: Date;
  username: string;
  type: string;
}
