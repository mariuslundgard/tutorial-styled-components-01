# tutorial-styled-components-01

This is a tutorial on how to use `styled-components` to build a UI library.

1. [Getting started](#1-getting-started)
2. [Change the default files](#2-change-the-default-files)
3. [The first styled component](#3-the-first-styled-component)
4. [The quintessential button component](#4-the-quintessential-button-component)
5. [Passing properties to styled components](#5-passing-properties-to-styled-components)
6. [Composing and reusing styles](#6-composing-and-reusing-styles)
7. [Theming](#7-theming)
8. [Global styles](#8-global-styles)
9. [Wrapping up](#9-wrapping-up)
10. [The end](#10-the-end)

## 1. Getting started

```sh
# Create a new React app
yarn create react-app tutorial-styled-components-01

# Open the React app project
cd tutorial-styled-components-01

# Install styled-components
yarn add styled-components
```

## 2. Change the default files

In `src/index.js`:

```diff
import React from 'react';
import ReactDOM from 'react-dom';
- import './index.css';
- import App from './App';
+ import {App} from './app';
- import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

- // If you want your app to work offline and load faster, you can change
- // unregister() to register() below. Note this comes with some pitfalls.
- // Learn more about service workers: https://bit.ly/CRA-PWA
- serviceWorker.unregister();

```

Next, let’s rename the app file:

```sh
# Since we cannot simply change the casing using `mv` we’re using an intermediate step
mv src/App.js src/_app.js
mv src/_app.js src/app.js
```

In `src/app.js`:

```diff
import React from 'react';
- import logo from './logo.svg';
- import './App.css';

- function App() {
+ export function App() {
-   return (
-     <div className="App">
-       <header className="App-header">
-         <img src={logo} className="App-logo" alt="logo" />
-         <p>
-           Edit <code>src/App.js</code> and save to reload.
-         </p>
-         <a
-           className="App-link"
-           href="https://reactjs.org"
-           target="_blank"
-           rel="noopener noreferrer"
-         >
-           Learn React
-         </a>
-       </header>
-     </div>
-   );
+   return <div>App</div>
}

- export default App;
```

And lastly, let’s remove files that we will not need in this tutorial:

```sh
rm -f src/App.css
rm -f src/App.test.js
rm -f src/index.css
rm -f src/logo.svg
rm -f src/serviceWorker.js
rm -f src/setupTests.js
```

Now let’s start the development server before we continue:

```sh
yarn start
```

## 3. The first styled component


In a new file `src/components/box.js`:

```jsx
import styled from "styled-components";

export const Box = styled.div`
  background: #eee;
  padding: 1.25em;
`;
```

In `src/app.js`:

```diff
import React from "react";
+ import { Box } from "./components/box";

export function App() {
-   return <div>App</div>;
+   return <Box>Boxed app</Box>;
}
```

Hurray – we have introduced the first styled component into our project!

## 4. The quintessential button component

In a new file `src/components/button.js`:

```jsx
import React from "react";
import styled from "styled-components";

const Root = styled.button`
  appearance: none;
  font: inherit;
  border: 0;
  border-radius: 5px;
  margin: 0;
  padding: 1.25em;
  background: #06f;
  color: #fff;
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

And let’s import the `Button` in `src/app.js`:

```diff
import React from "react";
import { Box } from "./components/box";
+ import { Button } from "./components/button";

export function App() {
-   return <Box>Boxed app</Box>;
+   return (
+     <>
+       <Box>Boxed app</Box>
+       <Button>Button</Button>
+     </>
+   );
}
```

And although it’s not looking pretty (bare with me) our styled button is rendered!

## 5. Passing properties to styled components

In `src/components/box.js`:

```diff
import styled from "styled-components";

+ // Our spacing scale (design tokens)
+ const space = [0, 4, 8, 12, 20, 32, 52];

+ // A function that converts px to rem units
+ function rem(px) {
+   if (px === 0) return px;
+   return `${px / 16}rem`;
+ }

export const Box = styled.div`
  background: #eee;
-   padding: 1.25em;
+   padding: ${({ padding }) => rem(space[padding || 0])};
`;
```

In `src/components/button.js`:

```diff
import React from "react";
- import styled from "styled-components";
+ import styled, { css } from "styled-components";
+ 
+ // Our button colors (design tokens)
+ const color = {
+   button: {
+     tones: {
+       default: {
+         bg: "#777",
+         fg: "#fff",
+       },
+       brand: {
+         bg: "#06f",
+         fg: "#fff",
+       },
+     },
+   },
+ };
+ 
+ // A "mixin" helper for rendering color-specific CSS
+ function buttonColorStyles(props) {
+   const tone = color.button.tones[props.tone || "default"];
+ 
+   return css`
+     background: ${tone.bg};
+     color: ${tone.fg};
+   `;
+ }

const Root = styled.button`
  appearance: none;
  font: inherit;
  border: 0;
  border-radius: 5px;
  margin: 0;
  padding: 1.25em;
-   background: #06f;
-   color: #fff;
+   ${buttonColorStyles}
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

In `src/app.js`:

```diff
import React from "react";
import { Box } from "./components/box";
import { Button } from "./components/button";

export function App() {
  return (
    <>
-       <Box>Boxed app</Box>
+       <Box padding={2}>Boxed app</Box>
      <Button>Button</Button>
+       <Button tone="brand">Button</Button>
    </>
  );
}
```

Now we can control the padding of the `Box` component using its `padding` property, which takes a value between 0–6 and is based on the spacing scale from our design tokens. And we can change the `tone` property of the `Button` to make it appear in different colors.

## 6. Composing and reusing styles


So far, we have defined styles specifically for use in one component at a time. The `Box` has its own styles, and so does the `Button`.

One thing that’s similar both for `Box` and `Button` is the padding property. So let’s look into how we can reuse the padding styles.

Firstly, we need to make the `Box` padding styles reusable.

In `src/components/box.js`:

```diff
- import styled from "styled-components";
+ import styled, { css } from "styled-components";

// Our spacing scale (design tokens)
const space = [0, 4, 8, 12, 20, 32, 52];

// A function that converts px to rem units
function rem(px) {
  if (px === 0) return px;
  return `${px / 16}rem`;
}

+ // The reusable box padding styles
+ export function boxPaddingStyles (props) {
+   const { padding } = props;

+   return css`
+     padding: ${rem(space[padding || 0])};
+   `;
+ }

export const Box = styled.div`
  background: #eee;
-   padding: ${({ padding }) => rem(space[padding || 0])};
+   ${boxPaddingStyles}
`;
```

In `src/components/Button.js`:

```diff
import React from "react";
import styled, { css } from "styled-components";
+ import { boxPaddingStyles } from "./box";

// Our button colors (design tokens)
const color = {
  button: {
    tones: {
      default: {
        bg: "#777",
        fg: "#fff",
      },
      brand: {
        bg: "#06f",
        fg: "#fff",
      },
    },
  },
};

// A "mixin" helper for rendering color-specific CSS
function buttonColorStyles(props) {
  const tone = color.button.tones[props.tone || "default"];

  return css`
    background: ${tone.bg};
    color: ${tone.fg};
  `;
}

const Root = styled.button`
  appearance: none;
  font: inherit;
  border: 0;
  border-radius: 5px;
  margin: 0;
-   padding: 1.25em;
  ${buttonColorStyles}
+   ${boxPaddingStyles}
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

In `src/app.js`:

```diff
import React from "react";
import { Box } from "./components/box";
import { Button } from "./components/button";

export function App() {
  return (
    <>
      <Box padding={2}>Boxed app</Box>
-       <Button>Button</Button>
+       <Button padding={2}>Button</Button>
-       <Button tone="brand">Button</Button>
+       <Button padding={2} tone="brand">
+         Button
+       </Button>
    </>
  );
}
```

## 7. Theming

`styled-components` comes with a builtin approach that makes it easy to make components themable.

Let’s start by copying and removing the spacing space from the `Box` component.

In `src/components/box.js`:

```diff
import styled, { css } from "styled-components";

- // Our spacing scale (design tokens)
- const space = [0, 4, 8, 12, 20, 32, 52];

// A function that converts px to rem units
function rem(px) {
  if (px === 0) return px;
  return `${px / 16}rem`;
}

// The reusable box padding styles
export function boxPaddingStyles(props) {
  const { padding } = props;

  return css`
    padding: ${rem(space[padding || 0])};
  `;
}

export const Box = styled.div`
  background: #eee;
  ${boxPaddingStyles}
`;
```

And paste the `space` tokens in a new file `src/theme.js`:

```js
// Our spacing scale (design tokens)
const space = [0, 4, 8, 12, 20, 32, 52];

export default { space };
```

Let’s do the same with the `color` tokens in the `Button` component.

Copy and remove the `color` variable in `src/components/button.js`:

```diff
import React from "react";
import styled, { css } from "styled-components";
import { boxPaddingStyles } from "./box";

- // Our button colors (design tokens)
- const color = {
-   button: {
-     tones: {
-       default: {
-         bg: "#777",
-         fg: "#fff",
-       },
-       brand: {
-         bg: "#06f",
-         fg: "#fff",
-       },
-     },
-   },
- };

// A "mixin" helper for rendering color-specific CSS
function buttonColorStyles(props) {
  const tone = color.button.tones[props.tone || "default"];

  return css`
    background: ${tone.bg};
    color: ${tone.fg};
  `;
}

const Root = styled.button`
  appearance: none;
  font: inherit;
  border: 0;
  border-radius: 5px;
  margin: 0;
  ${boxPaddingStyles}
  ${buttonColorStyles}
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

And paste it in `src/theme.js`:

```diff
// Our spacing scale (design tokens)
const space = [0, 4, 8, 12, 20, 32, 52];

+ // Our button colors (design tokens)
+ const color = {
+   button: {
+     tones: {
+       default: {
+         bg: "#777",
+         fg: "#fff",
+       },
+       brand: {
+         bg: "#06f",
+         fg: "#fff",
+       },
+     },
+   },
+ };

- export default { space };
+ export default { color, space };
```

In `src/app.js`:

```diff
import React from "react";
+ import { ThemeProvider } from "styled-components";
import { Box } from "./components/box";
import { Button } from "./components/button";
+ import theme from './theme'

export function App() {
  return (
-     <>
+     <ThemeProvider theme={theme}>
      <Box padding={2}>Boxed app</Box>
      <Button padding={2}>Button</Button>
      <Button padding={2} tone="brand">
        Button
      </Button>
-     </>
+     </ThemeProvider>
  );
}
```

In `src/components/box.js`:

```diff
import styled, { css } from "styled-components";

// A function that converts px to rem units
function rem(px) {
  if (px === 0) return px;
  return `${px / 16}rem`;
}

// The reusable box padding styles
export function boxPaddingStyles(props) {
-   const { padding } = props;
+   const {
+     padding,
+     theme: { space },
+   } = props;

  return css`
    padding: ${rem(space[padding || 0])};
  `;
}

export const Box = styled.div`
  background: #eee;
  ${boxPaddingStyles}
`;
```

In `src/components/button.js`:

```diff
import React from "react";
import styled, { css } from "styled-components";
import { boxPaddingStyles } from "./box";

// A "mixin" helper for rendering color-specific CSS
function buttonColorStyles(props) {
+   const { color } = props.theme;
  const tone = color.button.tones[props.tone || "default"];

  return css`
    background: ${tone.bg};
    color: ${tone.fg};
  `;
}

const Root = styled.button`
  appearance: none;
  font: inherit;
  border: 0;
  border-radius: 5px;
  margin: 0;
  ${boxPaddingStyles}
  ${buttonColorStyles}
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

## 8. Global styles

`styled-components` comes with a builtin approach to global styles.

One benefit of this approach, is that it makes it possible to use the theme values in the global context.

In `src/theme.js`:

```diff
// Our spacing scale (design tokens)
const space = [0, 4, 8, 12, 20, 32, 52];

// Our button colors (design tokens)
const color = {
  button: {
    tones: {
      default: {
        bg: "#777",
        fg: "#fff",
      },
      brand: {
        bg: "#06f",
        fg: "#fff",
      },
    },
  },
+   global: {
+     bg: '#fff',
+     fg: '#222',
+   },
};

export default { color, space };
```

In a new file `src/components/globalStyle.js`

```js
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
```

In `src/app.js`:

```diff
import React from "react";
import { ThemeProvider } from "styled-components";
import { Box } from "./components/box";
import { Button } from "./components/button";
+ import { GlobalStyle } from "./components/globalStyle";
import theme from "./theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
+       <GlobalStyle />
      <Box padding={2}>Boxed app</Box>
      <Button padding={2}>Button</Button>
      <Button padding={2} tone="brand">
        Button
      </Button>
    </ThemeProvider>
  );
}
```

## 9. Wrapping up

So now we have made styled components, started composing and reusing styles, and setup theming and global styles.

Lastly, let’s do some cleaning up.

### Cleaning up the `Box` component

The `Box` component is meant to be a layout utility component for easily creating padded frames using our design tokens. It shouldn’t have a background color (which we only used to be able to see what we were doing), so let’s remove it.

In `src/components/box.js`:

```diff
import styled, { css } from "styled-components";

// A function that converts px to rem units
function rem(px) {
  if (px === 0) return px;
  return `${px / 16}rem`;
}

// The reusable box padding styles
export function boxPaddingStyles(props) {
  const {
    padding,
    theme: { space },
  } = props;

  return css`
    padding: ${rem(space[padding || 0])};
  `;
}

export const Box = styled.div`
-   background: #eee;
  ${boxPaddingStyles}
`;
```

### Cleaning up the `Button` component

The button has some base styles, which are not defined in a "mixin". Let’s clean it up by moving those to a new function called `buttonBaseStyles`.

In `src/components/button.js`:

```diff
import React from "react";
import styled, { css } from "styled-components";
import { boxPaddingStyles } from "./box";

+ function buttonBaseStyles() {
+   return css`
+     appearance: none;
+     font: inherit;
+     border: 0;
+     border-radius: 5px;
+     margin: 0;
+   `;
+ }

// A "mixin" helper for rendering color-specific CSS
function buttonColorStyles(props) {
  const { color } = props.theme;
  const tone = color.button.tones[props.tone || "default"];

  return css`
    background: ${tone.bg};
    color: ${tone.fg};
  `;
}

const Root = styled.button`
-   appearance: none;
-   font: inherit;
-   border: 0;
-   border-radius: 5px;
-   margin: 0;
+   ${buttonBaseStyles}
  ${boxPaddingStyles}
  ${buttonColorStyles}
`;

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

### A pattern for composing styles has formed!

We now have two components which follow this pattern of composing styles:

```js
const StyledDiv = styled.div`
  ${mixin1}
  ${mixin2}
  /* etc */
`
```

But since `styled-components` supports passing the mixin functions as arguments, we can instead do this:

```js
const StyledDiv = styled.div(
  mixin1,
  mixin2
  // etc
)
```

In `src/components/box.js`:

```diff
import styled, { css } from "styled-components";

// A function that converts px to rem units
function rem(px) {
  if (px === 0) return px;
  return `${px / 16}rem`;
}

// The reusable box padding styles
export function boxPaddingStyles(props) {
  const {
    padding,
    theme: { space },
  } = props;

  return css`
    padding: ${rem(space[padding || 0])};
  `;
}

- export const Box = styled.div`
-   ${boxPaddingStyles}
- `;
+ export const Box = styled.div(boxPaddingStyles);
```

In `src/components/button.js`:

```diff
import React from "react";
import styled, { css } from "styled-components";
import { boxPaddingStyles } from "./box";

function buttonBaseStyles() {
  return css`
    appearance: none;
    font: inherit;
    border: 0;
    border-radius: 5px;
    margin: 0;
  `;
}

// A "mixin" helper for rendering color-specific CSS
function buttonColorStyles(props) {
  const { color } = props.theme;
  const tone = color.button.tones[props.tone || "default"];

  return css`
    background: ${tone.bg};
    color: ${tone.fg};
  `;
}

- const Root = styled.button`
-   ${buttonBaseStyles}
-   ${boxPaddingStyles}
-   ${buttonColorStyles}
- `;
+ const Root = styled.button(
+   buttonBaseStyles,
+   boxPaddingStyles,
+   buttonColorStyles
+ );

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
```

## 10. The end

This tutorial has presented a few approaches to using `styled-components`, though there are many others.

I have found the approaches presented above to be both readable and scalable and to grow with the library as new components are introduced.
