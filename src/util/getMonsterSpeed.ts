export const getMonsterSpeed = (wave: number) => {
  let speed = 1;
  if (wave > 2) {
    speed += (wave - 2) * 0.1;
  }
  return Math.min(speed, 5);
};
