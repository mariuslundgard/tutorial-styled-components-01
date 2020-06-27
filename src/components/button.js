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

const Root = styled.button(
  buttonBaseStyles,
  boxPaddingStyles,
  buttonColorStyles
);

export function Button(props) {
  const { children, ...restProps } = props;

  return <Root {...restProps}>{children}</Root>;
}
