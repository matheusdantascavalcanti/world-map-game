// src/utils/gameUtils.ts

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

// Categorize countries by difficulty
const easyCountries = [
  "United States", "Canada", "Brazil", "China", "India", "Australia", "Russia", "Japan", "United Kingdom", "France"
];

const mediumCountries = [
  "Mexico", "Argentina", "Egypt", "Vietnam", "Turkey", "Poland", "Sweden", "South Africa", "Thailand", "Spain"
];

const hardCountries = [
  "Luxembourg", "Bhutan", "Nauru", "Vanuatu", "Eswatini", "San Marino", "Togo", "Burundi", "Malawi", "Djibouti"
];

// Function to start a new round and select a random country based on difficulty
export const startNewRound = (roundNumber: number, guessedCountries: Set<string>): string => {
  let countryList;

  if (roundNumber <= 4) {
    countryList = easyCountries;  // First 4 rounds use easy countries
  } else if (roundNumber <= 7) {
    countryList = mediumCountries;  // Next 3 rounds use medium countries
  } else {
    countryList = hardCountries;  // Last 3 rounds use hard countries
  }

  // Filter out already guessed countries
  const availableCountries = countryList.filter(country => !guessedCountries.has(country));

  if (availableCountries.length === 0) {
    console.error('No more available countries in this difficulty level.');
    return ''; // Handle this case appropriately
  }

  const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
  guessedCountries.add(randomCountry); // Add the selected country to guessed list
  console.log(`New country to find: ${randomCountry}`); // Debugging log
  return randomCountry;
};

// Utility function to generate a random pastel color in RGB format
export const getRandomPastelColor = () => {
  const r = Math.floor(Math.random() * 115 + 115);
  const g = Math.floor(Math.random() * 115 + 115);
  const b = Math.floor(Math.random() * 115 + 115);
  return `rgb(${r}, ${g}, ${b})`;
};

// Function to initialize the map
export const initializeMap = (
  chartRef: React.MutableRefObject<am4maps.MapChart | null>,
  countryToGuessRef: React.MutableRefObject<string | null>,
  setCountryToGuess: React.Dispatch<React.SetStateAction<string | null>>,
  setRoundNumber: React.Dispatch<React.SetStateAction<number>>,
  roundNumber: number,
  guessedCountries: Set<string>
) => {
  const chart = am4core.create("chartdiv", am4maps.MapChart);
  chart.geodata = am4geodata_worldLow;
  chart.projection = new am4maps.projections.Miller();

  const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
  polygonSeries.useGeodata = true;

  const polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";

  // Apply random pastel color to each country on initialization only
  polygonTemplate.events.on("inited", (ev) => {
    const target = ev.target;
    const pastelColor = am4core.color(getRandomPastelColor());
    target.fill = pastelColor;
    const originalFill = target.fill;

    // Set hover event to lighten the color
    target.events.on("over", () => {
      target.fill = (originalFill as am4core.Color).lighten(0.2);
    });

    target.events.on("out", () => {
      target.fill = originalFill;
    });
  });

  // Handle click event using the ref to get the latest country to guess
  polygonTemplate.events.on("hit", (ev: any) => {
    const clickedCountry = ev.target.dataItem.dataContext.name;
    console.log(
      `Clicked on: ${clickedCountry}, Current country to guess: ${countryToGuessRef.current}`
    ); // Debugging log

    if (
      countryToGuessRef.current &&
      clickedCountry.toLowerCase() === countryToGuessRef.current.toLowerCase()
    ) {
      alert(`Correct! You found ${clickedCountry}.`);

      // Use functional update to ensure we use the latest state value
      setRoundNumber(prevRoundNumber => {
        if (prevRoundNumber < 10) {
          const newRoundNumber = prevRoundNumber + 1;
          console.log(`Round number updated to: ${newRoundNumber}`); // Debugging log

          const newCountry = startNewRound(newRoundNumber, guessedCountries);
          setCountryToGuess(newCountry);
          countryToGuessRef.current = newCountry; // Update ref with the new country
          return newRoundNumber; // Return the updated round number
        } else {
          alert("Congratulations! You've completed all rounds!");
          console.log("Game completed"); // Debugging log
          return prevRoundNumber; // Return the current round number if the game is completed
        }
      });
    } else {
      alert(`Incorrect. Try again!`);
    }
  });

  chartRef.current = chart;

  // Start the game by selecting a random country
  const initialCountry = startNewRound(roundNumber, guessedCountries); // Pass roundNumber to select difficulty
  setCountryToGuess(initialCountry); // Set the initial country to guess
  countryToGuessRef.current = initialCountry; // Also set the ref to the initial country

  return chart;
};
