// src/WorldMap.tsx

import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { initializeMap } from "./utils/gameUtils"; // Import game initialization logic
import CountryPrompt from "./CountryPrompt";

am4core.useTheme(am4themes_animated);

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
    <div id="game">
      <CountryPrompt countryToGuess={countryToGuess} roundNumber={roundNumber} />
      <div id="chartdiv" />
    </div>
  );
};

export default WorldMap;
