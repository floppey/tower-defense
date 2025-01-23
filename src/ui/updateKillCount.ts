export const updateKillCount = (numberOfKills: number) => {
  const killElement = document.getElementById("kills");
  if (killElement) {
    killElement.innerText = numberOfKills.toLocaleString("en-US");
  }
};
