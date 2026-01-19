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

export interface CreateDestinationInput {
  name: string;
  serverUrl: string;
  serverKey: string;
}

export interface UpdateDestinationInput
  extends Partial<CreateDestinationInput> {
  _id: string;
}
