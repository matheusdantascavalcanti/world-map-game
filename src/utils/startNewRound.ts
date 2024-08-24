import { easyCountries, hardCountries, mediumCountries } from "./countryList";

// Function to start a new round and select a random country based on difficulty
export const startNewRound = (
  roundNumber: number,
  guessedCountries: Set<string>
): string => {
  let countryList;

  if (roundNumber <= 4) {
    countryList = easyCountries;
  } else if (roundNumber <= 7) {
    countryList = mediumCountries;
  } else {
    countryList = hardCountries;
  }

  // Filter out already guessed countries
  const availableCountries = countryList.filter(
    (country) => !guessedCountries.has(country)
  );

  if (availableCountries.length === 0) {
    console.error("No more available countries in this difficulty level.");
    return "";
  }

  const randomCountry =
    availableCountries[Math.floor(Math.random() * availableCountries.length)];
  guessedCountries.add(randomCountry); // Add the selected country to guessed list
  console.log(`New country to find: ${randomCountry}`); // Debugging log
  return randomCountry;
};
