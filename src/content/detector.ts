import { LearningSource } from '../parsers/types';

export function isSessionUnfinished(
  completionPercent: number,
  parser: LearningSource,
  customThreshold?: number
): boolean {
  const threshold = customThreshold !== undefined ? customThreshold : parser.getCompletionThreshold();

  // If completion percentage is below threshold and user started learning (> 2% progress or > 10 seconds spent)
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
