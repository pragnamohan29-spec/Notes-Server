import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { query } = await request.json()
    
    // Use Gemini for deep research and synthesis
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' }); 
    
    const prompt = `You are a professional deep research assistant. 
      A user has asked the following query: "${query}"
      
      Please perform a comprehensive analysis and provide a detailed research report. 
      Include:
      1. Executive Summary
      2. Detailed Findings
      3. Key Insights
      4. Potential Solutions/Next Steps
      Keep the formatting professional and structured using markdown.`;

    const result = await model.generateContent(prompt);
    const researchResults = result.response.text();

    return NextResponse.json({ results: researchResults })
  } catch (error: any) {
    console.error('Research failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to perform research' }, { status: 500 });
  }
}
