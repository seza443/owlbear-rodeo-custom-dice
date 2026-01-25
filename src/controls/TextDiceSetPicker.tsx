import { useState, useEffect, useRef } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { diceCountsToText, textToDiceCounts } from "../helpers/textHelpers";
import { useDiceControlsStore, type DiceCounts } from "./store";


export function TextDiceSetPicker() {
  const diceById = useDiceControlsStore((state) => state.diceById);
  const diceCounts = useDiceControlsStore((state) => state.diceCounts);
  const diceBonus = useDiceControlsStore((state) => state.diceBonus);
  const setDiceBonus = useDiceControlsStore((state) => state.setDiceBonus);
  const setDiceCount = useDiceControlsStore((state) => state.setDiceCount);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current && inputRef.current) {
      const newText = diceCountsToText(diceCounts, diceBonus);
      setText(newText);
    }
  }, [diceCounts, diceBonus]);

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

  function onTextChange(text: string) {
    setText(text);
    const { dice, mod } = textToDiceCounts(text);
    setDiceCount(mapToDiceSet(dice));
    setDiceBonus(mod);
  }

  return (
    <Stack direction="column" justifyContent="center">
      <TextField
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        inputRef={inputRef}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.16) !important",
        }}
      />
    </Stack>
  );
}
