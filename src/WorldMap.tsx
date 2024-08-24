// src/WorldMap.tsx

import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { initializeMap } from "./utils/gameUtils"; // Import game initialization logic

am4core.useTheme(am4themes_animated);

// Define a Child Component to receive props
const CountryPrompt: React.FC<{ countryToGuess: string | null; roundNumber: number }> = ({
  countryToGuess,
  roundNumber,
}) => <h2>Round {roundNumber}: Find {countryToGuess}</h2>;

const WorldMap: React.FC = () => {
  const chartRef = useRef<am4maps.MapChart | null>(null);
  const [countryToGuess, setCountryToGuess] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1); // Initialize round number
  const countryToGuessRef = useRef<string | null>(null); // Ref to hold the current country to guess
  const guessedCountries = useRef<Set<string>>(new Set()); // Set to track guessed countries

  useEffect(() => {
    // Initialize the map using the utility function
    const chart = initializeMap(chartRef, countryToGuessRef, setCountryToGuess, setRoundNumber, roundNumber, guessedCountries.current);

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    // Sync ref with state whenever the state changes
    countryToGuessRef.current = countryToGuess;
  }, [countryToGuess]);

  return (
    <div>
      {/* Pass countryToGuess and roundNumber as props to the child component */}
      <CountryPrompt countryToGuess={countryToGuess} roundNumber={roundNumber} />
      <div id="chartdiv" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default WorldMap;
