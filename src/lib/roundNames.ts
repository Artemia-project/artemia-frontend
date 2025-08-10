export const getRoundName = (round: number): string => {
  switch(round) {
    case 1: return '16강전';
    case 2: return '8강전';
    case 3: return '준결승';
    case 4: return '결승전';
    default: return `${round}라운드`;
  }
};