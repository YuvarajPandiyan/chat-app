export const clipboardWriteText = (text) => {
  if (typeof navigator?.clipboard?.writeText !== "function") {
    return;
  }
  navigator.clipboard.writeText(text);
};
