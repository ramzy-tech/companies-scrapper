export default async function checkOnlineStatus() {
  try {
    await fetch("https://dns.google/resolve", { cache: "no-store" });
    return true; // either true or false
  } catch (err) {
    return false; // definitely offline
  }
}
