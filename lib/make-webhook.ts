import { SubmitPayload } from './types';

export async function postToMake(payload: SubmitPayload): Promise<void> {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('MAKE_WEBHOOK_URL is not configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Make webhook responded with status ${response.status}`);
  }
}
