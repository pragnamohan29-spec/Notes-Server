import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import TranscriptClient from 'youtube-transcript-api'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { url } = await request.json()
    
    // Extract video ID (handles watch, shorts, live, embed, v/, and youtu.be)
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch?.[1];

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid or unsupported YouTube URL. Please use a direct link to the video.' }, { status: 400 });
    }

    // Get transcript
    let transcriptContent = '';
    try {
      const client = new TranscriptClient();
      await client.ready;
      const transcriptData = await client.getTranscript(videoId);
      
      if (!transcriptData || !transcriptData.lines) {
        throw new Error('Transcript data is empty or unavailable for this video.');
      }
      
      transcriptContent = transcriptData.lines.map((l: any) => l.text).join(' ');
    } catch (transcriptError: any) {
      console.error('Transcription failed:', transcriptError);
      return NextResponse.json({ 
        error: 'Could not retrieve transcript. This video might have captions disabled or be restricted.' 
      }, { status: 400 });
    }

    // Summarize with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert AI summarizer. Below is a transcript of a YouTube video. 
      Please provide a concise, high-quality summary with key takeaways and structured bullet points.
      
      Transcript: ${transcriptContent.substring(0, 20000)}...`; // Slightly larger transcript limit

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Summarization failed:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during summarization.' }, { status: 500 });
  }
}
