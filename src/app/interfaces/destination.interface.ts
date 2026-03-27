export interface IDestination {
  _id: string;
  name: string;
  serverUrl: string;
  serverKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
}
export interface IEnableDestination {
  id: string;
  enabled: boolean;
  streamId: string;
  name: string;
  server: string;
  key: string;
}
export interface CreateDestinationInput {
  name: string;
  serverUrl: string;
  serverKey: string;
}

export interface UpdateDestinationInput extends Partial<CreateDestinationInput> {
  _id: string;
}
