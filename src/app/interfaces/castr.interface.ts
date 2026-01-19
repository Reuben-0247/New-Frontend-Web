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

export interface IStreamStats {
  status: string;
  bitrate: number;
  last_dts: number;
  push_stats: Record<string, unknown>;
  alive: boolean;
  srt_port_resolve: boolean;
  retry_count: number;

  media_info: {
    flow_type: string;
    stream_id: number;
    tracks: VideoTrack[];
  };

  pull_urls: {
    rtmp?: string;
    srt?: string;
    [key: string]: string | undefined;
  };
}

// type Track = VideoTrack | AudioTrack;

interface TrackBase {
  track_id: string;
  content: "video" | "audio" | string;
  codec: string;
  bitrate: number;
  closed_captions: Record<string, unknown>;
  avg_fps?: number;
}

interface VideoTrack extends TrackBase {
  content: "video";
  profile?: string;
  level?: string;
  width: number;
  height: number;
  bframes?: number;
  fps?: number;
  avg_gop?: number;
  is_progressive?: boolean;
  last_gop?: number;
  length_size?: number;
  num_refs_frames?: number;
  pix_fmt?: string;
  pixel_height?: number;
  pixel_width?: number;
  sar_height?: number;
  sar_width?: number;
}

// interface AudioTrack extends TrackBase {
//   content: "audio";
//   channels?: number;
//   sample_rate?: number;
// }
