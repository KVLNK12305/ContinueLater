import { LearningSource } from '../parsers/types';

export function meetsEngagementThreshold(
  timeSpentSeconds: number,
  completionPercent: number
): boolean {
  return timeSpentSeconds >= 20 && completionPercent >= 5;
}

export function isSessionUnfinished(
  completionPercent: number,
  parser: LearningSource,
  customThreshold?: number
): boolean {
  const threshold = customThreshold !== undefined ? customThreshold : parser.getCompletionThreshold();
  return completionPercent < threshold;
}

export function isSessionCompleted(
  completionPercent: number,
  parser: LearningSource,
  customThreshold?: number
): boolean {
  const threshold = customThreshold !== undefined ? customThreshold : parser.getCompletionThreshold();
  return completionPercent >= threshold;
}
