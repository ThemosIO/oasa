const ratio = parseFloat(getComputedStyle(document.documentElement).fontSize);
const remToPx = rem => rem * ratio;
const pxToRem = px => px / ratio;

export { remToPx, pxToRem };
