export interface ICastr {
  _id?: string;
  castrStreamId: string;

  broadcastingStatus?: string; // default: "offline"

  name: string;

  metadata?: {
    title?: string;
    description?: string;
  };

  playBack?: {
    embedUrl?: string;
    hlsUrl?: string;
  };

  destinations?: Array<{
    name: string;
    template: string;
    server: string;
    key: string;
    enabled: boolean;
  }>;

  enabled?: boolean;

  ingestInfo?: {
    primaryUrl?: string;
    streamKey?: string;
    backupUrl?: string;
  };

  settings?: {
    abr?: boolean;
    cloudRecording?: boolean;
    chat_enabled?: boolean;
  };

  encoderProfile?: {
    resolution?: string;
    bitrate?: string;
    fps?: number;
  };

  vodId?: string;
}

export interface IStreamData {
  castrStreamId: string;
  broadcastingStatus: "online" | "offline";
  name: string;

  playBack: {
    embedUrl: string;
  };

  enabled: boolean;

  ingestInfo: {
    primaryUrl: string;
    streamKey: string;
  };

  settings: {
    abr: boolean;
    cloudRecording: boolean;
    chat_enabled: boolean;
  };

  _id: string;
  destinations: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
