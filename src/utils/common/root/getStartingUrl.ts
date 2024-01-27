import fs from "fs";
import isJSONFileValid from "./isJsonFileValid.js";
import path from "path";
import { fileURLToPath } from "url";
import getLastPageNumber from "./getLastPageNumber.js";

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
      url = `https://clutch.co/us/web-developers?page=${pageNumber}&reviews=1`;
    else if (!fs.existsSync(fileAbsolutePath)) url = process.env.CLUTCH_URL!;
    else if (isJSONFileValid(fileAbsolutePath))
      throw new Error(
        "The data file is complete please save it then delete it to start the scraping..."
      );
    else {
      const lastPageNumber = getLastPageNumber(fileAbsolutePath);
      if (lastPageNumber) {
        url = `https://clutch.co/us/web-developers?page=${lastPageNumber}&reviews=1`;
        sholudRewrite = false;
      } else {
        url = process.env.CLUTCH_URL!;
      }
    }
  } // Goodfirms Company
  else {
    if (pageNumber)
      url = `https://www.goodfirms.co/directory/cms/top-website-development-companies?page=${pageNumber}`;
    else if (!fs.existsSync(fileAbsolutePath)) url = process.env.GOODFIRMS_URL!;
    else if (isJSONFileValid(fileAbsolutePath))
      throw new Error(
        "The data file is complete please save it then delete it to start the scraping..."
      );
    else {
      const lastPageNumber = getLastPageNumber(fileAbsolutePath);
      if (lastPageNumber) {
        url = `https://www.goodfirms.co/directory/cms/top-website-development-companies?page=${lastPageNumber}`;
        sholudRewrite = false;
      } else {
        url = process.env.GOODFIRMS_URL!;
      }
    }
  }

  return { url, websiteName, sholudRewrite };
}
