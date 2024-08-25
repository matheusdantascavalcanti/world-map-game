import React from "react";
import { getRandomPastelColor } from "./utils/getRandomColor"; // Import your utility function

interface CountryPromptProps {
  countryToGuess: string | null;
  roundNumber: number;
}

const CountryPrompt: React.FC<CountryPromptProps> = ({
  countryToGuess,
  roundNumber,
}) => {
  const backgroundColor = getRandomPastelColor(); // Generate a random pastel color

  return (
    <div id='header' style={{ backgroundColor}}>
      <h2 className="header">
        Round {roundNumber}/10: Find {countryToGuess}
      </h2>
    </div>
  );
};

export default CountryPrompt;
