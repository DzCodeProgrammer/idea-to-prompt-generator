import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, category } = await req.json();
    console.log('Generating prompt for:', { topic, category });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompts: Record<string, string> = {
      'coding': 'You are an expert coding prompt engineer. Generate detailed, structured prompts for coding tasks that include: clear objectives, specific requirements, tech stack details, code structure guidelines, and expected output format. Make prompts comprehensive yet clear.',
      'art': 'You are an expert art and design prompt engineer. Generate creative, descriptive prompts for art and design that include: visual style, mood/atmosphere, color palette, composition details, artistic techniques, and reference styles. Make prompts vivid and inspiring.',
      'business': 'You are an expert business strategy prompt engineer. Generate strategic, actionable prompts for business ideas that include: market analysis requirements, target audience, unique value proposition, business model considerations, and key success metrics. Make prompts practical and insightful.',
      'research': 'You are an expert research and science prompt engineer. Generate thorough, methodical prompts for research tasks that include: research questions, methodology approach, data requirements, analysis framework, and expected outcomes. Make prompts rigorous and comprehensive.',
      'fun': 'You are an expert creative prompt engineer. Generate engaging, imaginative prompts for fun and creative tasks that include: theme, creative constraints, storytelling elements, interactive aspects, and unique twists. Make prompts entertaining and inspiring.'
    };

    const systemPrompt = systemPrompts[category] || systemPrompts['coding'];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Generate a high-quality, detailed prompt based on this topic: "${topic}". The prompt should be well-structured, actionable, and ready to use. Format it professionally with clear sections if needed.` 
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content;
    
    console.log('Prompt generated successfully');

    return new Response(
      JSON.stringify({ prompt: generatedPrompt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-prompt function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate prompt';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});