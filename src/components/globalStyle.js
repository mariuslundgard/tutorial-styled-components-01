import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  html {
    -webkit-font-smoothing: antialiased;
    font: 100%/1.5 -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${({ theme }) => theme.color.global.bg};
    color: ${({ theme }) => theme.color.global.fg};
  }

  body {
    margin: 0;
  }
`;
