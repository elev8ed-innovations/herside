// Server-only. Never import this from a Client Component.
// ANTHROPIC_API_KEY is only available server-side (never in the client bundle).

const MODEL = 'claude-sonnet-4-20250514';
const API_URL = 'https://api.anthropic.com/v1/messages';

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 400,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return '';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
    // Don't cache — insights are personalized per request
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Claude API error ${res.status}`);
    return '';
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}
