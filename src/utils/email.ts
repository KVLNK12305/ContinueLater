import { LearningObject } from '../types/learning-object';
import { formatRemainingTime } from './time';
import { buildResumeUrl } from './resume';

/**
 * Generates a pre-filled mailto: compose link (Zero API cost)
 */
export function generateMailtoUrl(item: LearningObject): string {
  const subject = `Continue learning: ${item.title}`;

  const remainingStr = formatRemainingTime(item.estimatedRemainingMinutes);
  const resumeUrl = buildResumeUrl(item);
  const body = `Hi there!

You recently paused your learning session on:
${item.title} (${item.subtitle})

Resume directly here:
${resumeUrl}

Progress: ${item.completionPercent}% completed
Estimated time remaining: ${remainingStr}

Sent via ContinueLater — Never lose your learning flow.`;

  const params = new URLSearchParams({
    subject,
    body
  });

  return `mailto:?${params.toString()}`;
}
