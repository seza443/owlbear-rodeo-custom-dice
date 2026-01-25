import { DiceCounts } from "../controls/store";

export function diceCountsToText(diceCounts: DiceCounts, diceBonus?: number): string {
  const diceText = Object.entries(diceCounts)
    .filter(([, count]) => count > 0)
    .map(([die, count]) => `${count}d${die.replace(/^.*D/i, "")}`)
    .join(" ");
  return (diceBonus && diceBonus !== 0) ? `${diceText} ${diceBonus > 0 ? "+" : "-"}${Math.abs(diceBonus)}` : diceText;
}

export function textToDiceCounts(text: string): { dice: DiceCounts, mod: number } {
  const diceCounts: DiceCounts = {
    D4: 0,
    D6: 0,
    D8: 0,
    D10: 0,
    D12: 0,
    D20: 0,
    D100: 0,
  };
  let modifier = 0;

  if (!text.trim()) return { dice: diceCounts, mod: 0 };

  const diceMatches = text.trim().matchAll(/(\d+)d(\d+)/gi);

  for (const dieMatch of diceMatches) {
    if (dieMatch) {
      const die = `D${Number(dieMatch[2])}`;
      if (die in diceCounts) {
        diceCounts[die] += Number(dieMatch[1]);
      }
      continue;
    }
  }

  const modMatches = text.trim().matchAll(/[+-]\d+/gi);

  for (const modMatch of modMatches) {
    if (modMatch) {
      modifier += Number(modMatch);
    }
  }

  return { dice: diceCounts, mod: modifier };
}