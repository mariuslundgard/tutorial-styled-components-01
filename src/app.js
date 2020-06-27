import React from "react";
import { ThemeProvider } from "styled-components";
import { Box } from "./components/box";
import { Button } from "./components/button";
import { GlobalStyle } from "./components/globalStyle";
import theme from "./theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Box padding={2}>Boxed app</Box>
      <Button padding={2}>Button</Button>
      <Button padding={2} tone="brand">
        Button
      </Button>
    </ThemeProvider>
  );
}
