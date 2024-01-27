import fs from "fs";

export default function readFileEnd(filePath: string, size: number) {
  const bufferSize = size; // Number of characters to read from the end
  const buffer = Buffer.alloc(bufferSize);

  try {
    // Read the last characters from the file
    const fd = fs.openSync(filePath, "r");
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
  } catch (error) {
    return "";
  }
}
