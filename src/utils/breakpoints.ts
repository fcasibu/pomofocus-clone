const breakpoints = {
  xs: 20,
  sm: 29.6875,
  md: 48,
  lg: 64,
  xl: 80,
  xxl: 90,
} as const;

export const media = {
  greaterThan: (breakpoint: keyof typeof breakpoints) => {
    return `(min-width: ${breakpoints[breakpoint]}em)`;
  },
  lessThan: (breakpoint: keyof typeof breakpoints) => {
    return `(max-width: ${breakpoints[breakpoint]}em)`;
  },
};
