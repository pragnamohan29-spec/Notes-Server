import TranscriptClient from 'youtube-transcript-api';

async function test() {
  const videoId = 'LfkpTSejDHs';
  console.log(`Testing transcript for video ID: ${videoId}`);
  
  try {
    const client = new TranscriptClient();
    await client.ready;
    const transcript = await client.getTranscript(videoId);
    console.log('Success! Transcript found.');
    console.log('First line:', transcript.lines[0]);
  } catch (error) {
    console.error('Failed to get transcript:', error);
  }
}

test();
