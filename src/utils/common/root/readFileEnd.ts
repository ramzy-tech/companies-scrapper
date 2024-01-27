import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function readFileEnd(filePath: string, size: number) {
  const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));

  const fileAbsolutePath = path.join(currentModuleDirectory, filePath);

  const bufferSize = size; // Number of characters to read from the end
  const buffer = Buffer.alloc(bufferSize);

  // Read the last characters from the file
  const fd = fs.openSync(fileAbsolutePath, "r");
  const fileSize = fs.fstatSync(fd).size;
  const bytesRead = fs.readSync(
    fd,
    buffer,
    0,
    bufferSize,
    fileSize - bufferSize
  );
  fs.closeSync(fd);

  return bytesRead === 0 ? "" : buffer.toString("utf-8", 0, bytesRead).trim();
}
