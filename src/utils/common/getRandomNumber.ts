export default function getRandomNumber(min: number, max: number) {
  // Generate a random number between min (inclusive) and max (exclusive)
  return Math.floor(Math.random() * (max - min) + min);
}
