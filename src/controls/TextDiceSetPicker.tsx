import { useState, useEffect, useRef, useMemo } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { diceCountsToText, textToDiceCounts } from "../helpers/textHelpers";
import { useDiceControlsStore, type DiceCounts, getDiceToRoll } from "./store";
import { useDiceRollStore } from "../dice/store";
import { useDiceHistoryStore } from "./history";
import { Die } from "../types/Die";
import { DiceType } from "../types/DiceType";


export function TextDiceSetPicker() {
  const diceById = useDiceControlsStore((state) => state.diceById);
  const diceCounts = useDiceControlsStore((state) => state.diceCounts);
  const defaultDiceCounts = useDiceControlsStore((state) => state.defaultDiceCounts);
  const diceBonus = useDiceControlsStore((state) => state.diceBonus);
  const diceAdvantage = useDiceControlsStore((state) => state.diceAdvantage);
  const diceHidden = useDiceControlsStore((state) => state.diceHidden);
  const setDiceBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setDiceAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);
  const setDiceCount = useDiceControlsStore((state) => state.setDiceCount);
  const resetDiceCounts = useDiceControlsStore((state) => state.resetDiceCounts);
  const setRollPressTime = useDiceControlsStore((state) => state.setDiceRollPressTime);
  const startRoll = useDiceRollStore((state) => state.startRoll);
  const pushRecentRoll = useDiceHistoryStore((state) => state.pushRecentRoll);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current && inputRef.current) {
      const newText = diceCountsToText(diceCounts, diceBonus, diceAdvantage);
      setText(newText);
    }
  }, [diceCounts, diceBonus, diceAdvantage]);

  function mapToDiceSet(diceCounts: DiceCounts): DiceCounts {
    const diceSetCounts: DiceCounts = {};
    for (const [id, count] of Object.entries(diceCounts)) {
      const dieFromSet = Object.values(diceById).find(die => die.type === id);
      if (dieFromSet) {
        diceSetCounts[dieFromSet.id] = count;
      }
    }
    return diceSetCounts;
  }

  const hasDice = useMemo(
    () =>
      !Object.entries(defaultDiceCounts).every(
        ([type, count]) => diceCounts[type as DiceType] === count
      ),
    [diceCounts, defaultDiceCounts]
  );

  function onTextChange(text: string) {
    setText(text);
    const { dice, mod, advantage } = textToDiceCounts(text);
    setDiceCount(mapToDiceSet(dice));
    setDiceBonus(mod);
    setDiceAdvantage(advantage);
  }

  function handleReset() {
    resetDiceCounts();
    setDiceBonus(0);
    setDiceAdvantage(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onTextChange(text);
      
      // Simulate button press by setting rollPressTime
      const pressTime = performance.now();
      setRollPressTime(pressTime);
      
      if (hasDice) {
        const dice = getDiceToRoll(diceCounts, diceAdvantage, diceById);
        // Calculate speed multiplier based on a simulated brief press (0.1 seconds)
        const activeTimeSeconds = 0.1;
        const speedMultiplier = Math.max(1, Math.min(10, activeTimeSeconds * 2));
        startRoll({ dice, bonus: diceBonus, hidden: diceHidden }, speedMultiplier);

        const rolledDiceById: Record<string, Die> = {};
        for (const id of Object.keys(diceCounts)) {
          if (!(id in rolledDiceById)) {
            rolledDiceById[id] = diceById[id];
          }
        }
        pushRecentRoll({ 
          advantage: diceAdvantage, 
          counts: diceCounts, 
          bonus: diceBonus, 
          diceById: rolledDiceById 
        });

        handleReset();
      }
      setRollPressTime(null);
    }
  }

  return (
    <Stack direction="column" justifyContent="center">
      <TextField
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.16) !important",
        }}
      />
    </Stack>
  );
}
