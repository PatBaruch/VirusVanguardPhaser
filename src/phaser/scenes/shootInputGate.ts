import { LevelId } from '../config/parityConstants.js';

export function canAcceptShootInput(levelId: LevelId): boolean {
  return levelId !== 0;
}
