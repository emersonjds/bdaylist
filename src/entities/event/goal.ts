export interface EventGoal {
  target: number;
  reached: number;
}

export function goalPercent(goal: EventGoal): number {
  if (goal.target <= 0) return 0;
  return Math.min(100, Math.round((goal.reached / goal.target) * 100));
}
