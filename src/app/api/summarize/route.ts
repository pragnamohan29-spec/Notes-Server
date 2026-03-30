import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { fetchTranscript } from 'youtube-transcript'
import axios from 'axios'

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
      // Primary: Direct YouTube scraping
      const transcriptData = await fetchTranscript(videoId);
      if (transcriptData && transcriptData.length > 0) {
        transcriptContent = transcriptData.map((l: any) => l.text).join(' ');
      } else {
        throw new Error('Direct transcript empty');
      }
    } catch (scraperError: any) {
      console.log('Direct scraper failed, trying youtube-transcript.io with user key...');
      try {
        // Fallback: User's provided service with key
        const response = await axios.post('https://www.youtube-transcript.io/api/transcripts', {
          ids: [videoId]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.YOUTUBE_TRANSCRIPT_IO_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data?.[0]?.lines) {
          transcriptContent = response.data[0].lines.map((l: any) => l.text).join(' ');
        } else {
          throw new Error('Service transcript empty');
        }
      } catch (serviceError: any) {
        console.error('Transcription failed entirely:', serviceError);
        return NextResponse.json({ 
          error: 'Could not retrieve transcript. This video might have captions disabled or be restricted.' 
        }, { status: 400 });
      }
    }

    // Summarize with Gemini
    console.log('Transcript retrieved, length:', transcriptContent.length);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `You are an expert AI summarizer. Below is a transcript of a YouTube video. 
      Please provide a concise, high-quality summary with key takeaways and structured bullet points.
      
      Transcript: ${transcriptContent.substring(0, 20000)}...`; // Slightly larger transcript limit

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // Save to unified history
    const { error: historyError } = await supabase
      .from('youtube_history')
      .insert({
        user_id: user.id,
        url: url,
        video_id: videoId,
        summary: summary
      });
      
    if (historyError) {
      console.error('Failed to save to youtube_history:', historyError);
    }

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Summarization failed:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during summarization.' }, { status: 500 });
  }
}
