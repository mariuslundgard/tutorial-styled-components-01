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

export const Box = styled.div(boxPaddingStyles);
