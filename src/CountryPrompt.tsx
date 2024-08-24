import React from "react";

interface CountryPromptProps {
  countryToGuess: string | null;
  roundNumber: number;
}

const CountryPrompt: React.FC<CountryPromptProps> = ({ countryToGuess, roundNumber }) => (
  <div>
    <h2>Round {roundNumber}: Find {countryToGuess}</h2>
  </div>
);

export default CountryPrompt;
