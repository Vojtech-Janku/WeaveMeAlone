import { test, expect } from '@playwright/test';

test('analyzeTablet solves a simple 2-color alternating pattern', async ({ page }) => {
  await page.goto('/');

  const result = await page.evaluate(() => {
    const colColors = [1, 2, 1, 2, 1, 2]; // 6 picks, alternating two colors
    return (window as any).analyzeTablet(colColors, false); // repeating = false
  });

  expect(result.warning).toBeNull();
  expect(result.turns).toHaveLength(6);
  expect(result.turns[0]).toBe('F');
});

// Replays a solved (threading, turns) pair the same way the physical tablet would:
// an F turn reveals threading[pos] then advances to fwd(pos); a B turn reveals
// threading[fwd(pos)] then retreats to bwd(pos). Returns the sequence of colors
// a weaver would actually see, pick by pick.
function replayTurns(threading: number[], turns: string[]): number[] {
  const fwd = (p: number) => (p + 1) % 4;
  const bwd = (p: number) => (p + 3) % 4;
  let pos = 0;
  const revealed: number[] = [];
  for (const turn of turns) {
    if (turn === 'F') {
      revealed.push(threading[pos]);
      pos = fwd(pos);
    } else {
      revealed.push(threading[fwd(pos)]);
      pos = bwd(pos);
    }
  }
  return revealed;
}

test('the solved threading + turns actually reproduce the requested colors', async ({ page }) => {
  await page.goto('/');

  const colColors = [1, 2, 1, 2, 2, 1, 2, 1]; // 8 picks, 2 colors
  const result = await page.evaluate((colColors) => {
    return (window as any).analyzeTablet(colColors, false);
  }, colColors);

  expect(result.warning).toBeNull();
  expect(replayTurns(result.threading, result.turns)).toEqual(colColors);
});
