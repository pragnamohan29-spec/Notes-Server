declare module 'youtube-transcript-api' {
  interface TranscriptLine {
    text: string;
    start: number;
    duration: number;
  }
  interface TranscriptData {
    lines: TranscriptLine[];
    id: string;
    title: string;
  }
  class TranscriptClient {
    ready: Promise<void>;
    constructor(options?: any);
    getTranscript(videoId: string, config?: any): Promise<TranscriptData>;
    bulkGetTranscript(videoIds: string[], config?: any): Promise<TranscriptData[]>;
  }
  export = TranscriptClient;
}
