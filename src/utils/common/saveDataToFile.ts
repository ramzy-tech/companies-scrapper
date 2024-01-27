import path from "path";
import ClutchCompanyType from "../../../types/ClutchCompany.js";
import { fileURLToPath } from "url";
import fs from "fs/promises";

export async function saveDataToFile(
  companies: Partial<ClutchCompanyType>[],
  filePath: string
) {
  try {
    const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));

    const fileAbsolutePath = path.join(currentModuleDirectory, filePath);

    const newDataString = JSON.stringify(companies, null, 2)
      .replace(/^\[|\]$/g, "")
      .concat(",");
    await fs.appendFile(fileAbsolutePath, newDataString, "utf8");
    console.log("Data appended to file successfully 😎😎😎");
  } catch (error: any) {
    console.error("Error appending data to file:", error?.message);
  }
}
