import { DiceCounts, Advantage } from "../controls/store";

export function diceCountsToText(diceCounts: DiceCounts, diceBonus?: number, diceAdvantage?: Advantage): string {
  const diceText = Object.entries(diceCounts)
    .filter(([, count]) => count > 0)
    .map(([die, count]) => `${count}d${die.replace(/^.*D/i, "")}`)
    .join(" ");
  
  let result = diceText;
  
  if (diceBonus && diceBonus !== 0) {
    result = `${result} ${diceBonus > 0 ? "+" : "-"}${Math.abs(diceBonus)}`;
  }
  
  if (diceAdvantage === "ADVANTAGE") {
    result = `${result} kh`;
  } else if (diceAdvantage === "DISADVANTAGE") {
    result = `${result} kl`;
  }
  
  return result;
}

export function textToDiceCounts(text: string): { dice: DiceCounts, mod: number, advantage: Advantage } {
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
  let advantage: Advantage = null;

  if (!text.trim()) return { dice: diceCounts, mod: 0, advantage: null };

  // Check for kh (keep highest) or kl (keep lowest) - case insensitive, anywhere in string
  const khMatch = text.match(/kh/i);
  const klMatch = text.match(/kl/i);
  
  if (khMatch) {
    advantage = "ADVANTAGE";
  } else if (klMatch) {
    advantage = "DISADVANTAGE";
  }

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

  return { dice: diceCounts, mod: modifier, advantage };
}