import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

import { InteractiveTray } from "./tray/InteractiveTray";
import { Sidebar } from "./controls/Sidebar";
import { TextDiceSetPicker } from "./controls/TextDiceSetPicker";

export function App() {
  return (
    <Container disableGutters maxWidth="md">
      <Stack direction="row" justifyContent="center">
        <Sidebar />
        <Stack direction="column" justifyContent="center" sx={{gap:2}}>
          <InteractiveTray />
          <TextDiceSetPicker />
        </Stack>
      </Stack>
    </Container>
  );
}
