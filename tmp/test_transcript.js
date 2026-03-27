const TranscriptClient = require('youtube-transcript-api').default;

async function test() {
  const videoId = 'LfkpTSejDHs';
  console.log(`Testing transcript for video ID: ${videoId}`);
  
  try {
    const client = new TranscriptClient();
    await client.ready;
    
    console.log('Listing transcripts...');
    try {
        const list = await client.listTranscripts(videoId);
        console.log('Available transcripts:', JSON.stringify(list, null, 2));
    } catch (listError) {
        console.error('Failed to list transcripts:', listError.message);
    }

    console.log('Getting default transcript...');
    const transcript = await client.getTranscript(videoId);
    console.log('Success! Transcript found.');
    console.log('First line:', transcript.lines[0]);
  } catch (error) {
    console.error('Failed to get transcript:', error.message);
  }
}

test();
