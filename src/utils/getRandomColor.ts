// Utility function to generate a random pastel color in RGB format
export const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 115 + 115);
    const g = Math.floor(Math.random() * 115 + 115);
    const b = Math.floor(Math.random() * 115 + 115);
    return `rgb(${r}, ${g}, ${b})`;
  };