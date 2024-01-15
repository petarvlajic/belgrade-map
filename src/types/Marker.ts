export interface MarkerType {
  id: number;
  gpsx: number;
  gpsy: number;
  zone: string;
  status: number;
  name: string;
}

export interface MarkerHistory {
  description: string;
  time: Date;
  username: string;
  type: string;
}
