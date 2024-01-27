import readFileEnd from "./readFileEnd.js";

export default function getLastPageNumber(filePath: string) {
  const lastCharchters = readFileEnd(filePath, 3000);
  const regex = /"page": "(\d+)"/g;

  let match;
  let lastPageNumber;

  while ((match = regex.exec(lastCharchters)) !== null) {
    lastPageNumber = match[1];
  }
  return lastPageNumber;
}
