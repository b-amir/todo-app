export const getTruncatedText = (text: string, length = 20) =>
  text.length > length ? `${text.substring(0, length)}...` : text;
