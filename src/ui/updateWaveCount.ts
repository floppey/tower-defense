export const updateWaveCount = (wave: number) => {
  const waveElement = document.getElementById("wave");
  if (waveElement) {
    waveElement.innerText = wave.toLocaleString("en-US");
  }
};
