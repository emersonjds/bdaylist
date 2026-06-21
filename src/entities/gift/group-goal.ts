export interface GroupGoal {
  target: number;
  collected: number;
}

export function groupGoalPercent(goal: GroupGoal): number {
  if (goal.target <= 0) return 0;
  return Math.min(100, Math.round((goal.collected / goal.target) * 100));
}
