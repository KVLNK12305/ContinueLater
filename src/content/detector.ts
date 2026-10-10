import { LearningSource } from '../parsers/types';

export function meetsEngagementThreshold(
  timeSpentSeconds: number,
  completionPercent: number
): boolean {
  // Engaged if user spent >= 15s active time OR progressed >= 5% OR spent >= 5s with some scroll progress
  return (
    timeSpentSeconds >= 15 ||
    completionPercent >= 5 ||
    (timeSpentSeconds >= 5 && completionPercent >= 2)
  );
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
