import fs from "fs";
import isJSONFileValid from "./isJsonFileValid.js";
import path from "path";
import { fileURLToPath } from "url";
import getLastPageNumber from "./getLastPageNumber.js";

function adjustURL(url: string, pageNumber: number) {
  if (url.includes('?')) {
    return `${url}&page=${pageNumber}`
  }
  return `${url}?page=${pageNumber}`
}
export default function getStartingUrl() {
  const websiteName = process.argv[2] as "clutch" | "goodfirms";
  if (!["clutch", "goodfirms"].includes(websiteName)) {
    throw new Error("Please enter a valid website name!!!");
  }

  const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const fileAbsolutePath = path.join(
    currentModuleDirectory,
    `../../../../${
      websiteName === "clutch" ? "clutch-data.json" : "goodfirms-data.json"
    }`
  );
  const pageNumber = process.argv[3]?.match(/--page=(\d+)/)?.[1];
  let url = "",
    sholudRewrite = true;

  if (websiteName === "clutch") {
    if (pageNumber)
      url = adjustURL(process.env.CLUTCH_URL as string, +pageNumber);
    else if (!fs.existsSync(fileAbsolutePath)) url = process.env.CLUTCH_URL!;
    else if (isJSONFileValid(fileAbsolutePath))
      throw new Error(
        "The data file is complete please save it then delete it to start the scraping..."
      );
    else {
      const lastPageNumber = getLastPageNumber(fileAbsolutePath);
      if (lastPageNumber) {
        url = adjustURL(process.env.CLUTCH_URL as string, +lastPageNumber + 1);
        sholudRewrite = false;
      } else {
        url = process.env.CLUTCH_URL!;
      }
    }
  } // Goodfirms Company
  else {
    if (pageNumber)
      url = adjustURL(process.env.GOODFIRMS_URL as string, +pageNumber);
    else if (!fs.existsSync(fileAbsolutePath)) url = process.env.GOODFIRMS_URL!;
    else if (isJSONFileValid(fileAbsolutePath))
      throw new Error(
        "The data file is complete please save it then delete it to start the scraping..."
      );
    else {
      const lastPageNumber = getLastPageNumber(fileAbsolutePath);
      if (lastPageNumber) {
        url = adjustURL(process.env.GOODFIRMS_URL as string, +lastPageNumber + 1);
        sholudRewrite = false;
      } else {
        url = process.env.GOODFIRMS_URL!;
      }
    }
  }

  return { url, websiteName, sholudRewrite };
}
