export interface WorkOrder {
  CreatedTime: string;
  Description: string;
  FixDescription: string;
  FixImageAfter: string;
  FixImageBefore: string;
  FixTime: string;
  Id: number;
  StationId: number;
  Status: number;
  StatusLabel: string;
  UserId: number;
  pathBefore: string;
  pathAfter: string;
}

export interface User {
  ID: number;
  Username: string;
  Password: string | null;
  Role: string | null;
}
