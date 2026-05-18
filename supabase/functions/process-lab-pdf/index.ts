// Supabase Edge Function — process-lab-pdf
// Accepts a base64-encoded PDF, sends to Claude Vision, extracts lab markers.
// Stores results in lab_results table.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { callClaudeJson } from '../_shared/anthropic.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const LAB_SYSTEM = `You are analyzing a medical lab report for a HerSide user.

Extract ALL markers with their values and reference ranges.
Flag anything that is:
- Below the low end of reference range → "below_range"
- Above the high end of reference range → "above_range"
- Within bottom 10% of range → "low_normal"
- Within top 10% of range → "high_normal"
- Within normal range (not bottom/top 10%) → "normal"

Pay special attention to:
Hormones: estradiol, progesterone, testosterone, FSH, LH, DHEA-S
Thyroid: TSH, Free T4, Free T3, reverse T3
Nutrients: ferritin, vitamin D (25-OH), B12, folate, iron, TIBC
Metabolic: fasting glucose, insulin, HbA1c
Inflammation: hsCRP, homocysteine

For each marker return a JSON object with:
- name: string (marker name)
- value: number
- unit: string
- low: number (reference range low)
- high: number (reference range high)
- status: "below_range" | "above_range" | "low_normal" | "high_normal" | "normal"
- clinically_significant: boolean
- symptoms_affected: string[] (common symptoms this marker affects)

Also note: what cycle day this was drawn (if provided in the document).
Hormone results mean different things at different cycle days.

Return JSON: { markers: [...], cycle_day_drawn: number | null, lab_date: string | null }`;

interface RequestBody {
  pdf_base64: string;
  media_type?: string;
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', ''),
  );

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  if (!body.pdf_base64) {
    return new Response(JSON.stringify({ error: 'pdf_base64 required' }), {
      status: 400,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  try {
    const result = await callClaudeJson<{
      markers: ExtractedMarker[];
      cycle_day_drawn: number | null;
      lab_date: string | null;
    }>(
      apiKey,
      LAB_SYSTEM,
      [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: body.media_type ?? 'application/pdf',
              data: body.pdf_base64,
            },
          },
          { type: 'text', text: 'Extract all lab markers from this report.' },
        ],
      }],
      2000,
    );

    // Flag markers outside normal range
    const flagged = result.markers.filter(m =>
      m.status === 'below_range' || m.status === 'above_range' ||
      m.status === 'low_normal' || m.status === 'high_normal'
    );

    // Store in lab_results
    const { data: labRecord, error: insertErr } = await supabase
      .from('lab_results')
      .insert({
        user_id: user.id,
        raw_pdf_url: null, // PDF not stored server-side (privacy)
        extracted_markers: result.markers,
        flagged_markers: flagged,
        cycle_day_drawn: result.cycle_day_drawn,
        lab_date: result.lab_date,
        processed_at: new Date().toISOString(),
        ai_summary: null, // generated on demand
      })
      .select('id')
      .single();

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({
      id: labRecord.id,
      markers: result.markers,
      flagged,
      cycle_day_drawn: result.cycle_day_drawn,
      lab_date: result.lab_date,
    }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('process-lab-pdf error:', err);
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }
});

interface ExtractedMarker {
  name: string;
  value: number;
  unit: string;
  low: number;
  high: number;
  status: 'below_range' | 'above_range' | 'low_normal' | 'high_normal' | 'normal';
  clinically_significant: boolean;
  symptoms_affected: string[];
}
