import { shortCuts } from "./shortcuts";

function tryURL(url) {
  try {
    return new URL(url);
  } catch (error) {
    return false;
  }
}

export default function getURL(text = "", searchEngineUrl = "") {
  text = text.trim();

  if (text == "") return searchEngineUrl;

  if (shortCuts[text]) return shortCuts[text];

  if (tryURL(text)) {
    return text;
  }

  if (
    !text.includes("//") &&
    !text.includes(" ") &&
    text.includes(".") &&
    tryURL("https://" + text)
  ) {
    return "https://" + text;
  }

  const url = new URL(searchEngineUrl);

  url.searchParams.set("q", text);

  return url.toString();
}
