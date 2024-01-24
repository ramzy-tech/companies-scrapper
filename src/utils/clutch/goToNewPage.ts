import { Page } from "puppeteer";
import delay from "../common/delay.js";
import getRandomNumber from "../common/getRandomNumber.js";

export default async function goToNewPage(
  page: Page,
  url: string,
  options: any
) {
  try {
    await page.goto(url, { ...options });
  } catch (error: any) {
    const isConnected = await checkOnlineStatus();

    if (isConnected) {
      console.log(error?.message);
    } else {
      while (true) {
        console.log("No internet access...");
        await delay(getRandomNumber(180, 360));
        const isConnected = await checkOnlineStatus();
        if (isConnected) {
          console.log("The connection is back now...");
          await page.reload({ ...options });
          break;
        }
      }
    }
  }
}

async function checkOnlineStatus() {
  try {
    await fetch("https://dns.google/resolve", { cache: "no-store" });
    return true; // either true or false
  } catch (err) {
    return false; // definitely offline
  }
}
