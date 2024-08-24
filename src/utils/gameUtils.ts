// src/utils/gameUtils.ts

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { easyCountries, mediumCountries, hardCountries } from "./countryList";
import { getRandomPastelColor } from "./getRandomColor";
import { toast } from "react-toastify"; // Import toast from react-toastify
import { startNewRound } from "./startNewRound";

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

  polygonTemplate.tooltipText = "?";

  polygonTemplate.events.on("inited", (ev) => {
    const target = ev.target;
    const pastelColor = am4core.color(getRandomPastelColor());
    target.fill = pastelColor;
    const originalFill = target.fill;

    target.events.on("over", () => {
      target.fill = (originalFill as am4core.Color).lighten(0.2);
    });

    target.events.on("out", () => {
      target.fill = originalFill;
      target.tooltipText = "?";
    });
  });

  // Handle click event using the ref to get the latest country to guess
  polygonTemplate.events.on("hit", (ev: any) => {
    const clickedCountry = ev.target.dataItem.dataContext.name;
    console.log(
      `Clicked on: ${clickedCountry}, Current country to guess: ${countryToGuessRef.current}`
    ); 

    ev.target.tooltipText = clickedCountry;

    if (
      countryToGuessRef.current &&
      clickedCountry.toLowerCase() === countryToGuessRef.current.toLowerCase()
    ) {
      toast.success(`Correct! You found ${clickedCountry}.`); 

      // Use functional update to ensure we use the latest state value
      setRoundNumber((prevRoundNumber) => {
        if (prevRoundNumber < 10) {
          const newRoundNumber = prevRoundNumber + 1;
          console.log(`Round number updated to: ${newRoundNumber}`);

          const newCountry = startNewRound(newRoundNumber, guessedCountries);
          setCountryToGuess(newCountry);
          countryToGuessRef.current = newCountry; 
          return newRoundNumber; 
        } else {
          toast.success("Congratulations! You've completed all rounds!"); 
          console.log("Game completed");
          return prevRoundNumber; 
        }
      });
    } else {
      toast.error(`Incorrect. Try again!`);
    }
  });

  chartRef.current = chart;

  const initialCountry = startNewRound(roundNumber, guessedCountries); // Pass roundNumber to select difficulty
  setCountryToGuess(initialCountry); 
  countryToGuessRef.current = initialCountry;

  return chart;
};
