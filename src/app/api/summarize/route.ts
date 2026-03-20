import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { YoutubeTranscript } from 'youtube-transcript-api'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { url } = await request.json()
    
    // Extract video ID
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/)?.[1];
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Get transcript
    const transcriptEntries = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptContent = transcriptEntries.map(e => e.text).join(' ');

    // Summarize with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert AI summarizer. Below is a transcript of a YouTube video. 
      Please provide a concise, high-quality summary with key takeaways and structured bullet points.
      
      Transcript: ${transcriptContent.substring(0, 15000)}...`; // Limit transcript size

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Summarization failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize video' }, { status: 500 });
  }
}
