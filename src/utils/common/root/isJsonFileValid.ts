import readFileEnd from "./readFileEnd.js";

export default function isJSONFileValid(filePath: string) {
  const lastCharchters = readFileEnd(filePath, 10);

  return lastCharchters.endsWith("]") ? true : false;
}
